import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { products, Product } from "@/lib/products";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function extractJSON(text: string): { productIds: number[]; summary: string } {
  // Try to extract JSON from markdown code blocks or raw text
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = codeBlockMatch ? codeBlockMatch[1] : text;

  // Find the first { ... } block
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object found in response");

  const parsed = JSON.parse(jsonMatch[0]);

  if (!Array.isArray(parsed.productIds) || typeof parsed.summary !== "string") {
    throw new Error("Invalid JSON structure from AI");
  }

  return parsed as { productIds: number[]; summary: string };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query: unknown = body?.query;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query must be a non-empty string" },
        { status: 400 }
      );
    }

    const productCatalog = JSON.stringify(
      products.map(({ id, name, category, price, description, tags }) => ({
        id,
        name,
        category,
        price,
        description,
        tags,
      })),
      null,
      2
    );

    const prompt = `You are an intelligent product discovery assistant. A user is searching for products using natural language.

User query: "${query.trim()}"

Available product catalog (JSON):
${productCatalog}

Your task:
1. Analyze the user's query carefully.
2. Identify which products from the catalog best match what the user is looking for.
3. Return ONLY a valid JSON object (no extra text, no markdown) in this exact format:
{
  "productIds": [<array of matching product IDs as numbers>],
  "summary": "<1-2 sentence explanation of why these products match the query>"
}

Rules:
- Only include products that genuinely match the query.
- If NO products match, return: {"productIds": [], "summary": "No products found that match your search."}
- Do NOT add any commentary, markdown, or text outside the JSON object.`;

    let aiResult: { productIds: number[]; summary: string };

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      aiResult = extractJSON(text);
    } catch {
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 }
      );
    }

    const matchedProducts: Product[] = aiResult.productIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);

    return NextResponse.json(
      {
        products: matchedProducts,
        summary: aiResult.summary,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

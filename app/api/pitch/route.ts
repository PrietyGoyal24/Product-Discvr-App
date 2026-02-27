import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { products } from "@/lib/products";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = body?.productId;

    if (!productId || typeof productId !== "number") {
      return NextResponse.json(
        { error: "Valid productId is required" },
        { status: 400 }
      );
    }

    const product = products.find((p) => p.id === productId);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const prompt = `You are a high-end sales expert. Write a compelling, 2-sentence "elevator pitch" for why someone should buy this specific product. 
Focus on its unique value proposition, quality, and how it solves a problem or enhances the user's life.

Product Details:
Name: ${product.name}
Category: ${product.category}
Price: $${product.price}
Description: ${product.description}
Tags: ${product.tags.join(", ")}

Your response must be ONLY the 2-sentence pitch text. No markdown, no quotes, no extra text.`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      const pitch = result.response.text().trim();

      return NextResponse.json(
        { pitch },
        { status: 200 }
      );
    } catch (err: unknown) {
      console.error("Gemini Pitch Error:", err);
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 }
      );
    }
  } catch (err: unknown) {
    console.error("Internal Pitch Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

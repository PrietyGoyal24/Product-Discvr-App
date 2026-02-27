import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.toLowerCase();
    const q = searchParams.get("q")?.toLowerCase();
    const id = searchParams.get("id");

    let filtered = [...products];

    // Filter by specific ID
    if (id) {
      const numId = parseInt(id, 10);
      const product = products.find((p) => p.id === numId);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product, { status: 200 });
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter((p) =>
        p.category.toLowerCase().includes(category)
      );
    }

    // Filter by keyword (name, description, tags)
    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return NextResponse.json(filtered, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

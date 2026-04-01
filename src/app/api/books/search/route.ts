import { type NextRequest, NextResponse } from "next/server";

import { searchBooks } from "@/lib/google-books";
import type { BookSearchResult } from "@/features/books/types/book-api";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) {
    const result: BookSearchResult = { ok: true, items: [] };
    return NextResponse.json(result);
  }

  const items = await searchBooks(q);
  const result: BookSearchResult = { ok: true, items };
  return NextResponse.json(result);
}

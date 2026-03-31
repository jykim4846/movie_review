import { NextResponse } from "next/server";

import { searchMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const result = await searchMovies(query);

  return NextResponse.json(result);
}

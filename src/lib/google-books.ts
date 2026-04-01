import type { BookSearchItem, SelectedBook } from "@/features/books/types/book-api";

const BASE_URL = "https://www.googleapis.com/books/v1";

function extractIsbn(identifiers?: Array<{ type: string; identifier: string }>) {
  return (
    identifiers?.find((id) => id.type === "ISBN_13")?.identifier ??
    identifiers?.find((id) => id.type === "ISBN_10")?.identifier ??
    null
  );
}

function secureCoverUrl(url?: string): string | null {
  if (!url) return null;
  // zoom=0 → 원본 고화질, curl=0 → 책 모서리 효과 제거
  return url
    .replace(/^http:\/\//, "https://")
    .replace(/&zoom=\d/, "&zoom=0")
    .replace(/zoom=\d/, "zoom=0");
}

function bestCoverUrl(imageLinks?: Record<string, string>): string | null {
  if (!imageLinks) return null;
  const preferred = ["extraLarge", "large", "medium", "small", "thumbnail", "smallThumbnail"];
  for (const key of preferred) {
    if (imageLinks[key]) return secureCoverUrl(imageLinks[key]);
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSearchItem(item: any): BookSearchItem {
  const info = item.volumeInfo ?? {};
  return {
    id: item.id as string,
    title: info.title ?? "제목 없음",
    authors: info.authors ?? [],
    publishedYear: info.publishedDate ? String(info.publishedDate).slice(0, 4) : null,
    coverUrl: bestCoverUrl(info.imageLinks),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSelectedBook(id: string, item: any): SelectedBook {
  const info = item.volumeInfo ?? {};
  return {
    externalBookId: id,
    title: info.title ?? "제목 없음",
    authors: info.authors ?? [],
    publisher: info.publisher ?? null,
    publishedDate: info.publishedDate ? `${String(info.publishedDate).slice(0, 4)}-01-01` : null,
    coverUrl: bestCoverUrl(info.imageLinks),
    description: info.description ?? null,
    pageCount: info.pageCount ?? null,
    categories: info.categories ?? [],
    isbn: extractIsbn(info.industryIdentifiers),
  };
}

export async function searchBooks(query: string): Promise<BookSearchItem[]> {
  try {
    const url = `${BASE_URL}/volumes?q=${encodeURIComponent(query)}&maxResults=20&printType=books&langRestrict=ko`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.items ?? []).map((item: any) => toSearchItem(item));
  } catch {
    return [];
  }
}

export async function getBookById(id: string): Promise<SelectedBook | null> {
  try {
    const res = await fetch(`${BASE_URL}/volumes/${encodeURIComponent(id)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return toSelectedBook(id, data);
  } catch {
    return null;
  }
}

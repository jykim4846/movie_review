export type BookSearchItem = {
  id: string;
  title: string;
  authors: string[];
  publishedYear: string | null;
  coverUrl: string | null;
};

export type SelectedBook = {
  externalBookId: string;
  title: string;
  authors: string[];
  publisher: string | null;
  publishedDate: string | null;
  coverUrl: string | null;
  description: string | null;
  pageCount: number | null;
  categories: string[];
  isbn: string | null;
};

export type BookSearchResult =
  | { ok: true; items: BookSearchItem[] }
  | { ok: false; message: string; items: [] };

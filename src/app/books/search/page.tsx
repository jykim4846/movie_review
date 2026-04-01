import { BookSearchClient } from "@/features/books/components/book-search-client";

export default function BookSearchPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <BookSearchClient />
    </main>
  );
}

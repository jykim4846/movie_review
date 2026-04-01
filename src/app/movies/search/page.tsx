import { MovieSearchClient } from "@/features/movies/components/movie-search-client";

export default function MovieSearchPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <MovieSearchClient />
    </main>
  );
}

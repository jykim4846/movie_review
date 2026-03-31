import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { MovieSearchClient } from "@/features/movies/components/movie-search-client";

export default async function MovieSearchPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <MovieSearchClient />
    </main>
  );
}

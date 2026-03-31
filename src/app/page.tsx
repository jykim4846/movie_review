import { MovieEntryForm } from "@/features/movie-diary/components/movie-entry-form";
import { MovieEntryList } from "@/features/movie-diary/components/movie-entry-list";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <MovieEntryForm />
      <MovieEntryList />
    </main>
  );
}

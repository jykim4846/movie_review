import Link from "next/link";
import { redirect } from "next/navigation";

import { GeneratorForm } from "@/features/generator/components/generator-form";
import { getMovieById } from "@/lib/tmdb";

type Props = { searchParams: Promise<{ movieId?: string }> };

export default async function MovieGeneratePage({ searchParams }: Props) {
  const { movieId } = await searchParams;
  if (!movieId) redirect("/movies/search");

  const movie = await getMovieById(movieId);
  if (!movie) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="card-surface p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">오류</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">영화 정보를 불러오지 못했습니다</h2>
          <Link href="/movies/search" className="mt-5 inline-flex rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950">
            다시 검색하기
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <GeneratorForm
        type="movie"
        title={movie.title}
        coverUrl={movie.posterUrl}
        description={movie.overview}
        publishedYear={movie.releaseDate ? movie.releaseDate.slice(0, 4) : null}
      />
    </main>
  );
}

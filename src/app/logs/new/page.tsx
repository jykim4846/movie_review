import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { MovieEntryForm } from "@/features/movie-diary/components/movie-entry-form";
import { hasMovieApiEnv } from "@/lib/env";
import { getMovieById } from "@/lib/tmdb";

type LogsNewPageProps = {
  searchParams: Promise<{
    movieId?: string;
  }>;
};

export default async function NewMovieLogPage({ searchParams }: LogsNewPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { movieId } = await searchParams;
  if (!movieId) {
    redirect("/movies/search");
  }

  const movie = await getMovieById(movieId);
  if (!movie) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="card-surface p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
            영화 정보를 불러오지 못했습니다
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">선택한 영화를 찾을 수 없습니다</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {hasMovieApiEnv()
              ? "영화 상세 정보를 가져오는 중 문제가 발생했습니다. 다시 검색해 주세요."
              : "TMDB API 토큰이 설정되지 않아 선택한 영화 정보를 불러올 수 없습니다."}
          </p>
          <Link
            href="/movies/search"
            className="mt-5 inline-flex rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
          >
            영화 검색으로 돌아가기
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <MovieEntryForm selectedMovie={movie} />

      <section className="card-surface p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {movie.posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={movie.posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-36 w-24 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-36 w-24 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/50 px-3 text-center text-xs text-slate-400">
              포스터 없음
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
              선택한 영화
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{movie.title}</h2>
            {movie.releaseDate ? (
              <p className="mt-2 text-sm text-slate-300">{movie.releaseDate.slice(0, 4)}년 개봉</p>
            ) : null}
            {movie.originalTitle && movie.originalTitle !== movie.title ? (
              <p className="mt-1 text-sm text-slate-400">{movie.originalTitle}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-slate-100">줄거리</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-slate-100">기본 정보</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              러닝타임: {movie.runtime ? `${movie.runtime}분` : "정보 없음"}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              장르: {movie.genres.length > 0 ? movie.genres.join(", ") : "정보 없음"}
            </p>
          </div>

          <Link
            href="/movies/search"
            className="inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            다른 영화 다시 검색
          </Link>
        </div>
      </section>
    </main>
  );
}

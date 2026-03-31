import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DeleteLogButton } from "@/features/movie-diary/components/delete-log-button";
import { MovieLogCard } from "@/features/movie-diary/components/movie-log-card";
import { deleteMovieEntry } from "@/features/movie-diary/actions/movie-entry-actions";
import { getUserMovieLogs } from "@/features/movie-diary/lib/movie-log-queries";

export default async function LogsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const entries = await getUserMovieLogs(session.user.id);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
            내 영화 기록
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">최신순 기록 목록</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            내가 저장한 영화 기록만 최신순으로 표시됩니다.
          </p>
        </div>
        <Link
          href="/movies/search"
          className="inline-flex rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
        >
          새 기록 추가
        </Link>
      </section>

      {entries.length === 0 ? (
        <section className="card-surface px-4 py-10 text-center sm:px-6">
          <p className="text-lg font-semibold text-white">아직 저장된 영화 기록이 없습니다.</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            영화 검색부터 시작해서 첫 번째 감상 기록을 남겨 보세요.
          </p>
          <Link
            href="/movies/search"
            className="mt-5 inline-flex rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
          >
            영화 검색하러 가기
          </Link>
        </section>
      ) : (
        <section className="grid gap-4">
          {entries.map((entry) => (
            <form key={entry.id}>
              <MovieLogCard
                entry={entry}
                action={<DeleteLogButton onDelete={() => deleteMovieEntry(entry.id)} />}
              />
            </form>
          ))}
        </section>
      )}
    </main>
  );
}

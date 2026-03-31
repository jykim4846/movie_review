import { auth } from "@/auth";
import { deleteMovieEntry } from "@/features/movie-diary/actions/movie-entry-actions";
import { DeleteLogButton } from "@/features/movie-diary/components/delete-log-button";
import { MovieLogCard } from "@/features/movie-diary/components/movie-log-card";
import { getUserMovieLogs } from "@/features/movie-diary/lib/movie-log-queries";
import { hasRequiredServerEnv } from "@/lib/env";

export async function MovieEntryList() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const entries = hasRequiredServerEnv() ? await getUserMovieLogs(session.user.id) : [];

  return (
    <section className="card-surface p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
          최근 기록
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">영화 다이어리</h2>
      </div>

      {!hasRequiredServerEnv() ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
          `DATABASE_URL`을 설정하면 실제 영화 기록을 조회할 수 있습니다.
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
          아직 저장된 영화 기록이 없습니다.
        </div>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <form key={entry.id}>
              <MovieLogCard
                entry={entry}
                action={<DeleteLogButton onDelete={() => deleteMovieEntry(entry.id)} />}
              />
            </form>
          ))}
        </div>
      )}
    </section>
  );
}

import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { MovieEntryForm } from "@/features/movie-diary/components/movie-entry-form";
import { getUserMovieLogById } from "@/features/movie-diary/lib/movie-log-queries";

type EditLogPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditLogPage({ params }: EditLogPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const entry = await getUserMovieLogById(session.user.id, id);

  if (!entry) {
    notFound();
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <MovieEntryForm entry={entry} mode="edit" />

      <section className="card-surface p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
          수정 안내
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">기록 내용을 다시 다듬어 보세요</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          영화 기본 정보와 감상 기록을 함께 수정할 수 있습니다. 저장 후 상세 페이지로 이동합니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/logs/${entry.id}`}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            상세로 돌아가기
          </Link>
          <Link
            href="/logs"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            목록으로 이동
          </Link>
        </div>
      </section>
    </main>
  );
}

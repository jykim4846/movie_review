import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { MovieEntryForm } from "@/features/movie-diary/components/movie-entry-form";
import { MovieEntryList } from "@/features/movie-diary/components/movie-entry-list";

export default async function DiaryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div className="grid gap-6">
        <section className="card-surface p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
            빠른 시작
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">영화를 검색해서 기록을 시작하세요</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            포스터와 개봉연도를 확인한 뒤 원하는 영화를 선택하면 기록 작성 화면으로 이동합니다.
          </p>
          <Link
            href="/movies/search"
            className="mt-5 inline-flex rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
          >
            영화 검색하러 가기
          </Link>
        </section>
        <MovieEntryForm />
      </div>
      <MovieEntryList />
    </main>
  );
}

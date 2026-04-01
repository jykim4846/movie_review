import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col items-center justify-center gap-8 px-4 py-12 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">
          인스타 소감 생성기
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">
          영화 · 책 소감을<br />인스타 게시물로
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          영화나 책을 고르고, 느낀 감정 키워드를 입력하면<br />
          AI가 인스타 게시용 캡션과 카드 이미지를 만들어드려요.
        </p>
      </div>

      <div className="grid w-full max-w-sm gap-4">
        <Link
          href="/movies/search"
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-5 transition hover:bg-white/10"
        >
          <div className="text-left">
            <p className="text-lg font-semibold text-white">영화 소감 쓰기</p>
            <p className="mt-1 text-sm text-slate-400">영화를 검색하고 소감을 생성하세요</p>
          </div>
          <span className="text-2xl">🎬</span>
        </Link>

        <Link
          href="/books/search"
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-5 transition hover:bg-white/10"
        >
          <div className="text-left">
            <p className="text-lg font-semibold text-white">책 소감 쓰기</p>
            <p className="mt-1 text-sm text-slate-400">책을 검색하고 소감을 생성하세요</p>
          </div>
          <span className="text-2xl">📚</span>
        </Link>
      </div>
    </main>
  );
}

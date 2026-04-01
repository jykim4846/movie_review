import Link from "next/link";

type AppShellProps = { children: React.ReactNode };

export async function AppShell({ children }: AppShellProps) {
  return (
    <div className="page-shell">
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="block">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              소감 끄적이기
            </p>
            <h1 className="mt-0.5 text-base font-bold text-white">인스타 게시물 생성기</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/movies/search"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white"
            >
              영화
            </Link>
            <Link
              href="/books/search"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white"
            >
              책
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

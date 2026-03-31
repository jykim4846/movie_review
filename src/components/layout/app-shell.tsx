type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="page-shell">
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
              Movie Diary MVP
            </p>
            <h1 className="mt-1 text-lg font-bold text-white">영화 기록 + 인스타 캡션 초안</h1>
          </div>
          <span className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-xs font-medium text-amber-100">
            초기 구조
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}

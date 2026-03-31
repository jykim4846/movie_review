import Link from "next/link";

import { auth } from "@/auth";
import { logout } from "@/features/auth/actions/auth-actions";

type AppShellProps = {
  children: React.ReactNode;
};

export async function AppShell({ children }: AppShellProps) {
  const session = await auth();

  return (
    <div className="page-shell">
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <Link href="/" className="block">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                Movie Diary MVP
              </p>
              <h1 className="mt-1 text-lg font-bold text-white">영화 기록 + 인스타 캡션 초안</h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <Link
                  href="/diary"
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white"
                >
                  내 기록
                </Link>
                <span className="hidden text-sm text-slate-300 sm:inline">
                  {session.user.name}님
                </span>
                <form action={logout}>
                  <button
                    type="submit"
                    className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-xs font-medium text-amber-100"
                  >
                    로그아웃
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-xs font-medium text-amber-100"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

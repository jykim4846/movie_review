"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup } from "@/features/auth/actions/auth-actions";

const initialState = {
  ok: false,
  message: "",
};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <section className="card-surface w-full max-w-md p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
          회원가입
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">영화 기록을 시작해 보세요</h2>
      </div>

      <form action={formAction} className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-100">이름</span>
          <input
            name="name"
            type="text"
            required
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="홍길동"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-100">이메일</span>
          <input
            name="email"
            type="email"
            required
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-100">비밀번호</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="8자 이상"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-100">비밀번호 확인</span>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="비밀번호를 다시 입력해 주세요"
          />
        </label>

        <div className="flex items-center justify-between gap-3">
          <p className={`text-sm ${state.ok ? "text-emerald-300" : "text-rose-300"}`}>
            {state.message || "회원가입 후 바로 내 영화 다이어리로 이동합니다."}
          </p>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:opacity-60"
          >
            {pending ? "가입 중" : "회원가입"}
          </button>
        </div>
      </form>

      <p className="mt-5 text-sm text-slate-300">
        이미 계정이 있다면{" "}
        <Link href="/login" className="font-semibold text-amber-300">
          로그인
        </Link>
      </p>
    </section>
  );
}

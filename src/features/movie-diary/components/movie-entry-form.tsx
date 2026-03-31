"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";

import {
  createMovieEntry,
  updateMovieEntry,
} from "@/features/movie-diary/actions/movie-entry-actions";
import { WATCH_METHOD_OPTIONS } from "@/features/movie-diary/constants/movie-form";
import type { SelectedMovie } from "@/features/movies/types/movie-api";
import type { MovieEntryDetail } from "@/types/movie-entry";

const initialState = {
  ok: false,
  message: "",
};

type MovieEntryFormProps = {
  selectedMovie?: SelectedMovie;
  entry?: MovieEntryDetail;
  mode?: "create" | "edit";
};

function getDateValue(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function MovieEntryForm({
  selectedMovie,
  entry,
  mode = "create",
}: MovieEntryFormProps) {
  const action = mode === "edit" ? updateMovieEntry : createMovieEntry;
  const [state, formAction] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && mode === "create") {
      formRef.current?.reset();
    }
  }, [mode, state.ok]);

  const title = selectedMovie?.title ?? entry?.title ?? "";
  const originalTitle = selectedMovie?.originalTitle ?? entry?.originalTitle ?? "";
  const releaseDate = selectedMovie?.releaseDate ?? getDateValue(entry?.releaseDate);
  const posterUrl = selectedMovie?.posterUrl ?? entry?.posterUrl ?? "";
  const overview = selectedMovie?.overview ?? entry?.overview ?? "";
  const runtime = selectedMovie?.runtime?.toString() ?? entry?.runtime?.toString() ?? "";
  const genres = selectedMovie?.genres ?? entry?.genres ?? [];

  return (
    <section className="card-surface p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
          새 기록 추가
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">영화 감상 입력</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          로그인한 사용자 계정에만 기록이 저장됩니다. 인스타 캡션 생성은 다음 단계에서 연결합니다.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="grid gap-4">
        {entry ? <input type="hidden" name="id" value={entry.id} /> : null}

        {selectedMovie || entry ? (
          <>
            <input
              type="hidden"
              name="externalMovieId"
              value={selectedMovie?.externalMovieId ?? entry?.externalMovieId ?? ""}
            />
            <input type="hidden" name="originalTitle" value={originalTitle} />
            <input type="hidden" name="releaseDate" value={releaseDate} />
            <input type="hidden" name="posterUrl" value={posterUrl} />
            <input type="hidden" name="overview" value={overview} />
            <input type="hidden" name="runtime" value={runtime} />
            <input type="hidden" name="genres" value={genres.join("|")} />
            <input type="hidden" name="redirectTo" value={mode === "edit" ? `/logs/${entry?.id ?? ""}` : "/logs"} />

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                {mode === "edit" ? "수정 중인 영화" : "선택한 영화"}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-slate-300">
                {releaseDate
                  ? `${releaseDate.slice(0, 4)}년 개봉`
                  : "개봉일 정보 없음"}
              </p>
            </div>
          </>
        ) : null}

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-100">영화 제목</span>
          <input
            name="title"
            type="text"
            required
            defaultValue={title}
            readOnly={Boolean(selectedMovie || entry)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
            placeholder="예: 패스트 라이브즈"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-100">관람일</span>
            <input
              name="watchedAt"
              type="date"
              required
              defaultValue={getDateValue(entry?.watchedAt)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-100">관람 장소</span>
            <input
              name="watchPlace"
              type="text"
              defaultValue={entry?.watchPlace ?? ""}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
              placeholder="예: CGV 왕십리"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-100">관람 방식</span>
            <select
              name="watchMethod"
              required
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0"
              defaultValue={entry?.watchMethod ?? ""}
            >
              <option value="" disabled>
                선택해 주세요
              </option>
              {WATCH_METHOD_OPTIONS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-100">같이 본 사람</span>
            <input
              name="companions"
              type="text"
              defaultValue={entry?.companions ?? ""}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
              placeholder="예: 혼자, 친구 1명, 가족"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-100">별점</span>
            <input
              name="rating"
              type="number"
              min="0.5"
              max="5"
              step="0.5"
              defaultValue={entry?.rating ?? ""}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0"
              placeholder="예: 4.5"
            />
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
            <input
              name="isSpoiler"
              type="checkbox"
              defaultChecked={entry?.isSpoiler ?? false}
              className="h-4 w-4 rounded border-white/20 bg-white/10"
            />
            <span>스포일러 포함</span>
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-100">한줄 감상</span>
          <textarea
            name="shortReview"
            required
            rows={4}
            defaultValue={entry?.shortReview ?? ""}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none ring-0 placeholder:text-slate-500"
            placeholder="예: 오래 남는 장면이 많은 영화였다."
          />
        </label>

        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-slate-400">
          캡션 톤과 초안 생성은 다음 단계에서 `GeneratedCaption` 모델과 연결할 예정입니다.
          준비된 톤 값은 감성형, 유쾌형, 담백형, 리뷰형입니다.
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className={`text-sm ${state.ok ? "text-emerald-300" : "text-rose-300"}`}>
            {state.message || "필수값: 영화 제목, 관람일, 관람 방식, 한줄 감상"}
          </p>
          <button
            type="submit"
            className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
          >
            {mode === "edit"
              ? "수정 저장하기"
              : selectedMovie
                ? "기록 저장하고 목록으로 이동"
                : "저장하기"}
          </button>
        </div>
      </form>
    </section>
  );
}

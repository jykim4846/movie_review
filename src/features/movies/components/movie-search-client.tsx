"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { MovieSearchResult } from "@/features/movies/types/movie-api";

const initialResult: MovieSearchResult = {
  ok: true,
  items: [],
};

export function MovieSearchClient() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<MovieSearchResult>(initialResult);
  const [isLoading, setIsLoading] = useState(false);
  const normalizedQuery = query.trim();

  useEffect(() => {
    if (!normalizedQuery) {
      setResult(initialResult);
      setIsLoading(false);
      return;
    }

    let isActive = true;
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/movies/search?q=${encodeURIComponent(normalizedQuery)}`);
        const data = (await response.json()) as MovieSearchResult;
        if (isActive) {
          setResult(data);
        }
      } catch {
        if (isActive) {
          setResult({
            ok: false,
            message: "검색 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
            items: [],
          });
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [normalizedQuery]);

  return (
    <section className="card-surface p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
          영화 검색
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">기록할 영화를 먼저 찾아보세요</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          제목으로 검색한 뒤 원하는 영화를 선택하면 기록 작성 화면으로 이동합니다.
        </p>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-100">영화 제목</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="예: 듄, 패스트 라이브즈, 기생충"
          />
        </label>

        {!normalizedQuery ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
            검색어를 입력하면 영화 결과가 여기에 표시됩니다.
          </div>
        ) : isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
            영화를 찾는 중입니다.
          </div>
        ) : !result.ok ? (
          <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-6 text-sm text-rose-200">
            {result.message}
          </div>
        ) : result.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
            검색 결과가 없습니다. 다른 제목으로 다시 시도해 주세요.
          </div>
        ) : (
          <div className="grid gap-3">
            {result.items.map((item) => (
              <Link
                key={item.id}
                href={`/logs/new?movieId=${item.id}`}
                className="grid grid-cols-[80px_1fr] gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
              >
                {item.posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.posterUrl}
                    alt={`${item.title} 포스터`}
                    className="h-[112px] w-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-[112px] w-20 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/50 px-2 text-center text-xs text-slate-400">
                    포스터 없음
                  </div>
                )}

                <div className="min-w-0 py-1">
                  <p className="text-base font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {item.releaseYear ? `${item.releaseYear}년 개봉` : "개봉연도 정보 없음"}
                  </p>
                  {item.originalTitle && item.originalTitle !== item.title ? (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-400">{item.originalTitle}</p>
                  ) : null}
                  <span className="mt-4 inline-flex rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-xs font-medium text-amber-100">
                    이 영화로 기록하기
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

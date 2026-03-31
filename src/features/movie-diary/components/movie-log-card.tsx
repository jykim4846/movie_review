import Link from "next/link";

import type { MovieEntry } from "@/types/movie-entry";
import { WATCH_METHOD_OPTIONS } from "@/features/movie-diary/constants/movie-form";

type MovieLogCardProps = {
  entry: MovieEntry;
  action?: React.ReactNode;
};

function getWatchMethodLabel(value: string) {
  return WATCH_METHOD_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function MovieLogCard({ entry, action }: MovieLogCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="grid grid-cols-[72px_1fr] gap-4">
        {entry.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.posterUrl}
            alt={`${entry.title} 포스터`}
            className="h-24 w-[72px] rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-24 w-[72px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/50 px-2 text-center text-xs text-slate-400">
            포스터 없음
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-slate-400">
                {new Date(entry.watchedAt).toLocaleDateString("ko-KR")} · {entry.watchPlace ?? "장소 미입력"}
              </p>
              <Link href={`/logs/${entry.id}`} className="mt-2 block text-lg font-semibold text-white">
                {entry.title}
              </Link>
              <p className="mt-2 text-xs text-slate-400">
                {getWatchMethodLabel(entry.watchMethod)}
                {entry.companions ? ` · ${entry.companions}` : ""}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">별점</p>
              <p className="text-base font-semibold text-amber-300">
                {entry.rating !== null && entry.rating !== undefined ? `${entry.rating} / 5` : "-"}
              </p>
            </div>
          </div>

          <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-300">
            {entry.shortReview || "한줄 감상은 아직 비어 있습니다."}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              {entry.isSpoiler ? "스포일러 포함" : "스포일러 없음"} / 생성된 캡션 {entry.generatedCaptionCount}개
            </div>
            {action}
          </div>
        </div>
      </div>
    </article>
  );
}

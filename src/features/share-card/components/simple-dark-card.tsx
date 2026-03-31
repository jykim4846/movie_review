import type { ShareCardProps } from "@/features/share-card/types/share-card";

export function SimpleDarkCard({
  posterUrl,
  title,
  watchedAt,
  secondaryInfo,
  rating,
  shortReview,
}: ShareCardProps) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,#0b1020_0%,#111827_48%,#1f2937_100%)] p-4 shadow-2xl shadow-black/30">
      <div className="grid min-h-[420px] gap-4 grid-rows-[auto_1fr_auto]">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-200/90">
          <span>Movie Diary</span>
          <span>{new Date(watchedAt).toLocaleDateString("ko-KR")}</span>
        </div>

        <div className="grid gap-4">
          {posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={posterUrl}
              alt={`${title} 포스터`}
              className="h-56 w-full rounded-[22px] object-cover"
            />
          ) : (
            <div className="flex h-56 w-full items-center justify-center rounded-[22px] border border-dashed border-white/10 bg-black/20 text-sm text-slate-400">
              포스터 없음
            </div>
          )}

          <div>
            <h3 className="text-2xl font-semibold leading-tight text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{secondaryInfo}</p>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">My Note</p>
            <p className="text-sm font-semibold text-amber-300">
              {rating !== null && rating !== undefined ? `${rating} / 5` : "평점 없음"}
            </p>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-100">
            {shortReview || "한줄 감상이 아직 비어 있습니다."}
          </p>
        </div>
      </div>
    </article>
  );
}

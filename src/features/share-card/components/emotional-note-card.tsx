import type { ShareCardProps } from "@/features/share-card/types/share-card";

export function EmotionalNoteCard({
  posterUrl,
  title,
  watchedAt,
  secondaryInfo,
  rating,
  shortReview,
}: ShareCardProps) {
  return (
    <article className="rounded-[28px] border border-[#d8cbb8] bg-[linear-gradient(180deg,#f6efe4_0%,#eadcc8_100%)] p-4 text-[#3d2f21] shadow-2xl shadow-black/15">
      <div className="grid min-h-[420px] gap-4 grid-rows-[auto_1fr_auto]">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e6f4d]">
          <span>Memory Note</span>
          <span>{new Date(watchedAt).toLocaleDateString("ko-KR")}</span>
        </div>

        <div className="grid gap-4">
          {posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={posterUrl}
              alt={`${title} 포스터`}
              className="h-56 w-full rounded-[22px] object-cover shadow-lg shadow-[#9d7a4a]/15"
            />
          ) : (
            <div className="flex h-56 w-full items-center justify-center rounded-[22px] border border-dashed border-[#c9b79f] bg-[#efe4d3] text-sm text-[#8d7353]">
              포스터 없음
            </div>
          )}

          <div className="rounded-[22px] border border-[#d3c0a8] bg-white/50 p-4">
            <h3 className="text-2xl font-semibold leading-tight">{title}</h3>
            <p className="mt-2 text-sm text-[#6f5740]">{secondaryInfo}</p>
          </div>
        </div>

        <div className="rounded-[22px] border border-[#d3c0a8] bg-white/55 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-[#8e6f4d]">Short Review</p>
            <p className="rounded-full bg-[#6d5237] px-3 py-1 text-xs font-semibold text-[#f7efe4]">
              {rating !== null && rating !== undefined ? `${rating} / 5` : "평점 없음"}
            </p>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#463728]">
            {shortReview || "한줄 감상이 아직 비어 있습니다."}
          </p>
        </div>
      </div>
    </article>
  );
}

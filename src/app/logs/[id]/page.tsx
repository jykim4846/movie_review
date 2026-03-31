import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { CopyCaptionButton } from "@/features/captions/components/copy-caption-button";
import { GenerateCaptionsButton } from "@/features/captions/components/generate-captions-button";
import { DeleteLogButton } from "@/features/movie-diary/components/delete-log-button";
import {
  deleteMovieEntryAndRedirect,
} from "@/features/movie-diary/actions/movie-entry-actions";
import { WATCH_METHOD_OPTIONS } from "@/features/movie-diary/constants/movie-form";
import { getUserMovieLogById } from "@/features/movie-diary/lib/movie-log-queries";
import { ShareCardPreview } from "@/features/share-card/components/share-card-preview";

type LogDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getWatchMethodLabel(value: string) {
  return WATCH_METHOD_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export default async function LogDetailPage({ params }: LogDetailPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const entry = await getUserMovieLogById(session.user.id, id);

  if (!entry) {
    notFound();
  }

  const secondaryInfo = entry.watchPlace
    ? `${entry.watchPlace} · ${getWatchMethodLabel(entry.watchMethod)}`
    : getWatchMethodLabel(entry.watchMethod);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="card-surface p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          {entry.posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.posterUrl}
              alt={`${entry.title} 포스터`}
              className="h-44 w-32 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-44 w-32 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/50 px-3 text-center text-xs text-slate-400">
              포스터 없음
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">
              영화 기록 상세
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{entry.title}</h2>
            {entry.originalTitle && entry.originalTitle !== entry.title ? (
              <p className="mt-1 text-sm text-slate-400">{entry.originalTitle}</p>
            ) : null}

            <div className="mt-4 grid gap-2 text-sm text-slate-300">
              <p>관람일: {new Date(entry.watchedAt).toLocaleDateString("ko-KR")}</p>
              <p>관람 방식: {getWatchMethodLabel(entry.watchMethod)}</p>
              <p>관람 장소: {entry.watchPlace || "미입력"}</p>
              <p>같이 본 사람: {entry.companions || "미입력"}</p>
              <p>별점: {entry.rating !== null && entry.rating !== undefined ? `${entry.rating} / 5` : "-"}</p>
              <p>스포일러: {entry.isSpoiler ? "포함" : "없음"}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <GenerateCaptionsButton logId={entry.id} />
              <Link
                href={`/logs/${entry.id}/edit`}
                className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
              >
                수정하기
              </Link>
              <Link
                href="/logs"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                목록으로
              </Link>
              <form>
                <DeleteLogButton onDelete={() => deleteMovieEntryAndRedirect(entry.id, "/logs")} />
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-slate-100">한줄 감상</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
              {entry.shortReview || "기록된 한줄 감상이 없습니다."}
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-slate-100">영화 정보</p>
            <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
              <p>개봉일: {entry.releaseDate ? entry.releaseDate.slice(0, 10) : "정보 없음"}</p>
              <p>러닝타임: {entry.runtime ? `${entry.runtime}분` : "정보 없음"}</p>
              <p>장르: {entry.genres.length > 0 ? entry.genres.join(", ") : "정보 없음"}</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {entry.overview || "줄거리 정보가 없습니다."}
            </p>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-100">생성된 캡션</p>
            <p className="text-xs text-slate-400">한 기록에 대해 여러 버전이 누적 저장됩니다.</p>
          </div>

          {entry.generatedCaptions.length === 0 ? (
            <p className="mt-3 text-sm leading-6 text-slate-300">
              아직 생성된 캡션이 없습니다.
            </p>
          ) : (
            <div className="mt-4 grid gap-4">
              {entry.generatedCaptions.map((caption) => (
                <article key={caption.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                      버전 {caption.versionNo} · {caption.tone}
                    </p>
                    <CopyCaptionButton
                      text={[caption.captionText, caption.hashtagsText].filter(Boolean).join("\n\n")}
                    />
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-200">
                    {caption.captionText}
                  </p>
                  <p className="mt-3 text-sm text-slate-400">
                    {caption.hashtagsText || "해시태그 없음"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <ShareCardPreview
            card={{
              posterUrl: entry.posterUrl,
              title: entry.title,
              watchedAt: entry.watchedAt,
              secondaryInfo,
              rating: entry.rating,
              shortReview: entry.shortReview,
            }}
          />
        </section>
      </section>
    </main>
  );
}

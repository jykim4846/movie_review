"use client";

import { useState } from "react";

import { PostResult } from "@/features/generator/components/post-result";
import type { GeneratedPost } from "@/features/generator/actions/generate-content";

const MOVIE_METHOD_OPTIONS = ["극장", "OTT", "TV", "DVD/Blu-ray", "기타"];
const BOOK_METHOD_OPTIONS = ["종이책", "전자책", "오디오북", "기타"];

type Props = {
  type: "movie" | "book";
  title: string;
  authors?: string[];
  coverUrl?: string | null;
  publisher?: string | null;
  publishedYear?: string | null;
  description?: string | null;
};

function ordinalKorean(n: number): string {
  const units = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열"];
  const tens = ["", "열", "스물", "서른", "마흔", "쉰", "예순", "일흔", "여든", "아흔"];
  if (n <= 0) return `${n}`;
  if (n < 11) return `${units[n]}번째`;
  const t = Math.floor(n / 10);
  const u = n % 10;
  return `${tens[t] ?? ""}${u > 0 ? units[u] : ""}번째`;
}

export function GeneratorForm({
  type,
  title,
  authors = [],
  coverUrl,
  publisher,
  publishedYear,
  description,
}: Props) {
  const methodOptions = type === "movie" ? MOVIE_METHOD_OPTIONS : BOOK_METHOD_OPTIONS;
  const dateLabel = type === "movie" ? "관람일" : "읽은 날짜";
  const methodLabel = type === "movie" ? "관람 방식" : "읽은 방식";
  const kind = type === "movie" ? "영화" : "책";

  const [count, setCount] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState("");
  const [rating, setRating] = useState("");
  const [emotions, setEmotions] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState("");

  const [claudePrompt, setClaudePrompt] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [claudeCopied, setClaudeCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);

  const [pastedText, setPastedText] = useState("");
  const [result, setResult] = useState<GeneratedPost | null>(null);

  function validate() {
    if (!count || !date || !method || !emotions) {
      setError(`${kind} 번호, 날짜, 방식, 감정 키워드는 필수입니다.`);
      return false;
    }
    setError("");
    return true;
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const ordinal = ordinalKorean(Number(count));
    const titleLine = `${kind} 소감 끄적이기 ${ordinal}`;

    // Claude.ai용 글 프롬프트
    const textPrompt = [
      `인스타그램에 ${kind} 소감 글을 써줘.`,
      "",
      `말투는 일상적이고 자연스럽게, 과장 없이 솔직하게 써줘.`,
      `구어체로, 친구에게 이야기하듯 써줘.`,
      `짧은 문장 여러 개로 나누고 줄바꿈을 자주 사용해줘.`,
      `없는 내용은 절대 지어내지 말고 아래 정보만 사용해줘.`,
      `마지막 줄은 반드시 '개인적인 평가: ${rating || "??"} / 5' 형식으로 끝내줘.`,
      `해시태그는 4~8개, 한국어 위주로, ${kind} 제목 포함해서 본문 아래에 붙여줘.`,
      `첫 줄은 반드시 "${titleLine}" 으로 시작해줘.`,
      "",
      `[${kind} 제목] ${title}`,
      authors.length ? `[저자] ${authors.join(", ")}` : "",
      `[${type === "movie" ? "관람일" : "읽은 날짜"}] ${date}`,
      `[${type === "movie" ? "관람 방식" : "읽은 방식"}] ${method}`,
      `[별점] ${rating || "없음"} / 5`,
      `[느낀 감정 키워드] ${emotions}`,
      memo ? `[추가 메모] ${memo}` : "",
    ].filter(Boolean).join("\n");

    // ChatGPT용 이미지 프롬프트
    const imgPrompt = [
      `인스타그램에 올릴 감성적인 이미지를 생성해줘.`,
      "",
      description ? `[${kind} 내용] ${description}` : `[${kind} 제목] ${title}`,
      `[느낀 감정] ${emotions}`,
      "",
      `스타일: 시네마틱하고 감성적인 분위기, ${type === "movie" ? "영화 포스터" : "북커버"} 느낌`,
      `비율: 정사각형 (1:1)`,
      `텍스트나 글자는 넣지 말아줘.`,
    ].filter(Boolean).join("\n");

    setClaudePrompt(textPrompt);
    setImagePrompt(imgPrompt);
    setResult(null);
    setPastedText("");
  }

  async function handleCopyClaude() {
    await navigator.clipboard.writeText(claudePrompt);
    setClaudeCopied(true);
    setTimeout(() => setClaudeCopied(false), 2000);
    window.open("https://claude.ai", "_blank");
  }

  async function handleCopyImage() {
    await navigator.clipboard.writeText(imagePrompt);
    setImageCopied(true);
    setTimeout(() => setImageCopied(false), 2000);
    window.open("https://chatgpt.com", "_blank");
  }

  function handlePastedSubmit() {
    if (!pastedText.trim()) return;
    setResult({ caption: pastedText.trim(), hashtags: "" });
  }

  return (
    <div className="grid gap-6">
      {/* 선택한 책/영화 정보 */}
      <section className="card-surface p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt={title} className="h-36 w-24 rounded-xl object-cover shadow-lg" />
          ) : (
            <div className="flex h-32 w-[86px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/50 text-xs text-slate-400">
              표지 없음
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">선택한 {kind}</p>
            <h2 className="mt-2 text-xl font-semibold leading-tight text-white">{title}</h2>
            {authors.length > 0 && <p className="mt-1 text-sm text-slate-300">{authors.join(", ")}</p>}
            {(publishedYear || publisher) && (
              <p className="mt-1 text-xs text-slate-400">
                {[publishedYear ? `${publishedYear}년` : null, publisher].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>
        {description && <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">{description}</p>}
      </section>

      {/* 입력 폼 */}
      <section className="card-surface p-5 sm:p-6">
        <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-amber-300">소감 입력</p>

        <form onSubmit={handleGenerate} className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-100">몇 번째 {kind}인가요?</span>
            <input
              type="number" min="1" value={count}
              onChange={(e) => setCount(e.target.value)} required
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="예: 16"
            />
            <p className="text-xs text-slate-400">"{kind} 소감 끄적이기 N번째" 형식의 제목에 사용돼요</p>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-100">{dateLabel}</span>
              <input
                type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-100">{methodLabel}</span>
              <select
                value={method} onChange={(e) => setMethod(e.target.value)} required
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="" disabled>선택해 주세요</option>
                {methodOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-100">별점 (선택)</span>
            <input
              type="number" min="0.5" max="5" step="0.5" value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              placeholder="예: 4.5"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-100">
              느낀 감정 키워드
              <span className="ml-2 text-xs font-normal text-slate-400">쉼표로 구분</span>
            </span>
            <input
              type="text" value={emotions} onChange={(e) => setEmotions(e.target.value)} required
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="예: 놀라움, 몰입, 약간의 아쉬움, 여운"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-100">추가로 넣고 싶은 내용 (선택)</span>
            <textarea
              value={memo} onChange={(e) => setMemo(e.target.value)} rows={3}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500"
              placeholder={type === "movie" ? "예: 원작 소설을 먼저 읽었다, 엔딩이 예상과 달랐다" : "예: 빌린 책이다, 1년 만에 다 읽었다"}
            />
          </label>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            프롬프트 생성하기
          </button>
        </form>
      </section>

      {/* 프롬프트 생성됨 */}
      {claudePrompt && (
        <div className="grid gap-4">
          {/* Claude.ai — 글 */}
          <section className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-indigo-950/20 p-5">
            <p className="mb-1 font-semibold text-white">① 글 생성 — Claude.ai</p>
            <p className="mb-4 text-xs text-slate-400">복사 후 Claude.ai에 붙여넣으면 인스타 소감 글이 생성돼요.</p>

            <button
              type="button"
              onClick={handleCopyClaude}
              className="mb-4 w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {claudeCopied ? "복사됨! Claude.ai가 열렸어요" : "글 프롬프트 복사 + Claude.ai 열기"}
            </button>

            <details>
              <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-300">프롬프트 미리보기</summary>
              <div className="mt-2 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                <p className="whitespace-pre-wrap text-xs leading-6 text-slate-300">{claudePrompt}</p>
              </div>
            </details>
          </section>

          {/* ChatGPT — 이미지 */}
          <section className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-950/20 to-emerald-950/20 p-5">
            <p className="mb-1 font-semibold text-white">② 이미지 생성 — ChatGPT</p>
            <p className="mb-4 text-xs text-slate-400">
              {description ? `${kind} 시놉시스 + 감정 키워드` : `${kind} 제목 + 감정 키워드`}를 바탕으로 이미지를 그려줘요. ChatGPT Plus 필요.
            </p>

            <button
              type="button"
              onClick={handleCopyImage}
              className="mb-4 w-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              {imageCopied ? "복사됨! ChatGPT가 열렸어요" : "이미지 프롬프트 복사 + ChatGPT 열기"}
            </button>

            <details>
              <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-300">프롬프트 미리보기</summary>
              <div className="mt-2 rounded-xl border border-white/10 bg-slate-950/50 p-4">
                <p className="whitespace-pre-wrap text-xs leading-6 text-slate-300">{imagePrompt}</p>
              </div>
            </details>
          </section>

          {/* 글 붙여넣기 */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="mb-1 font-semibold text-white">③ Claude가 생성한 글 붙여넣기</p>
            <p className="mb-4 text-xs text-slate-400">Claude.ai에서 생성된 글을 복사해서 아래에 붙여넣으세요.</p>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={8}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500"
              placeholder="Claude.ai에서 생성된 글을 여기에 붙여넣으세요..."
            />
            <button
              type="button"
              onClick={handlePastedSubmit}
              disabled={!pastedText.trim()}
              className="mt-3 w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              게시물 만들기
            </button>
          </section>
        </div>
      )}

      {/* 결과 */}
      {result && (
        <PostResult post={result} coverUrl={coverUrl} title={title} />
      )}
    </div>
  );
}

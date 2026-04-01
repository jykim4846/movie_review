"use client";

import { useState } from "react";

import type { GeneratedPost } from "@/features/generator/actions/generate-content";

type Props = {
  post: GeneratedPost;
  coverUrl?: string | null;
  title: string;
};

export function PostResult({ post, coverUrl, title }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(post.caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-950/20 to-purple-950/20 p-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-lg">✨</span>
        <p className="font-semibold text-white">생성된 인스타 게시물</p>
      </div>

      {/* 이미지 안내 */}
      <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-pink-300">
          게시물 이미지
        </p>
        {coverUrl ? (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={title}
              className="h-36 w-24 rounded-xl object-cover shadow-lg"
            />
            <div className="text-sm text-slate-300">
              <p>표지 이미지를 그대로 사용하세요.</p>
              <p className="mt-2 text-xs text-slate-400">이미지를 길게 누르거나<br />스크린샷으로 저장해 인스타에 올리세요.</p>
              <a
                href={coverUrl}
                download={`${title}.jpg`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                이미지 링크 열기
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">표지 이미지를 직접 준비해 주세요.</p>
        )}
      </div>

      {/* 캡션 */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-pink-300">
          캡션 (복사 후 인스타에 붙여넣기)
        </p>
        <div className="mb-4 rounded-xl border border-white/10 bg-slate-950/50 p-4">
          <p className="whitespace-pre-line text-sm leading-7 text-slate-100">
            {post.caption}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="w-full rounded-full bg-amber-300 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
        >
          {copied ? "복사됨!" : "캡션 전체 복사"}
        </button>
      </div>

      {/* 인스타그램 열기 */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-pink-300">
          게시하기
        </p>
        <p className="mb-3 text-sm text-slate-300">
          이미지를 저장하고, 캡션을 복사한 뒤 인스타그램에서 새 게시물을 올리세요.
        </p>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          인스타그램 열기
        </a>
      </div>
    </section>
  );
}

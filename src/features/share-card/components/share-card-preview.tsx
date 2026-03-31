"use client";

import { useState } from "react";

import { EmotionalNoteCard } from "@/features/share-card/components/emotional-note-card";
import { SimpleDarkCard } from "@/features/share-card/components/simple-dark-card";
import type { ShareCardProps } from "@/features/share-card/types/share-card";

type TemplateKey = "simple-dark" | "emotional-note";

type ShareCardPreviewProps = {
  card: ShareCardProps;
};

const templates: Array<{ key: TemplateKey; label: string }> = [
  { key: "simple-dark", label: "심플 다크" },
  { key: "emotional-note", label: "감성 노트형" },
];

export function ShareCardPreview({ card }: ShareCardPreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("simple-dark");

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-100">카드 미리보기</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            현재는 HTML/CSS 렌더링 기반입니다. 추후 이미지 export를 바로 붙일 수 있도록 구성했습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {templates.map((template) => (
            <button
              key={template.key}
              type="button"
              onClick={() => setSelectedTemplate(template.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedTemplate === template.key
                  ? "bg-amber-300 text-slate-950"
                  : "border border-white/15 bg-white/5 text-white"
              }`}
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-[32px] border border-white/10 bg-black/10 p-3">
        <div data-share-card-root>
          {selectedTemplate === "simple-dark" ? (
            <SimpleDarkCard {...card} />
          ) : (
            <EmotionalNoteCard {...card} />
          )}
        </div>
      </div>
    </section>
  );
}

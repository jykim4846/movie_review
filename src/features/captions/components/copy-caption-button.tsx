"use client";

import { useState } from "react";

type CopyCaptionButtonProps = {
  text: string;
};

export function CopyCaptionButton({ text }: CopyCaptionButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
    >
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

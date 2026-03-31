"use client";

import { useState, useTransition } from "react";

import { generateCaptionsForLog } from "@/features/captions/actions/generate-captions";

type GenerateCaptionsButtonProps = {
  logId: string;
};

export function GenerateCaptionsButton({ logId }: GenerateCaptionsButtonProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={() => {
          startTransition(async () => {
            const result = await generateCaptionsForLog(logId);
            setMessage(result.message);
          });
        }}
        className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:opacity-60"
        disabled={isPending}
      >
        {isPending ? "캡션 생성 중..." : "캡션 3종 생성"}
      </button>
      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}

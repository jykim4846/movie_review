"use server";

import { CaptionTone } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { buildCaptionGenerationPrompt, CAPTION_GENERATION_SCHEMA } from "@/features/captions/lib/caption-prompt";
import type { CaptionGenerationResult } from "@/features/captions/types/caption-generation";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { env, hasRequiredServerEnv } from "@/lib/env";

type CaptionActionState = {
  ok: boolean;
  message: string;
};

export async function generateCaptionsForLog(logId: string): Promise<CaptionActionState> {
  if (!hasRequiredServerEnv()) {
    return { ok: false, message: "DATABASE_URL이 없어 캡션을 생성할 수 없습니다." };
  }

  if (!env.openAiApiKey) {
    return { ok: false, message: "OPENAI_API_KEY가 없어 캡션 생성 기능을 사용할 수 없습니다." };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "로그인 후에 캡션을 생성할 수 있습니다." };
  }

  const movieLog = await prisma.movieLog.findFirst({
    where: {
      id: logId,
      userId: session.user.id,
    },
    include: {
      movie: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!movieLog) {
    return { ok: false, message: "캡션을 생성할 기록을 찾을 수 없습니다." };
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: "출력은 반드시 JSON 스키마에 맞춘다." }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildCaptionGenerationPrompt({
                title: movieLog.movie.title,
                watchedAt: movieLog.watchedAt.toISOString().slice(0, 10),
                watchPlace: movieLog.watchPlace,
                watchMethod: movieLog.watchMethod,
                rating: movieLog.rating ? Number(movieLog.rating) : null,
                shortReview: movieLog.shortReview,
                isSpoiler: movieLog.isSpoiler,
              }),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          ...CAPTION_GENERATION_SCHEMA,
        },
      },
    });

    const content = response.output_text;
    if (!content) {
      return { ok: false, message: "캡션 생성 응답을 해석하지 못했습니다." };
    }

    const parsed = JSON.parse(content) as CaptionGenerationResult;
    const tones = new Set(parsed.captions.map((caption) => caption.tone));

    if (
      parsed.captions.length !== 3 ||
      !tones.has("CALM") ||
      !tones.has("EMOTIONAL") ||
      !tones.has("REVIEW") ||
      parsed.hashtags.length < 5 ||
      parsed.hashtags.length > 8
    ) {
      return { ok: false, message: "캡션 생성 결과 형식이 올바르지 않습니다." };
    }

    const latestVersion = await prisma.generatedCaption.aggregate({
      where: {
        movieLogId: logId,
      },
      _max: {
        versionNo: true,
      },
    });

    const nextVersionNo = (latestVersion._max.versionNo ?? 0) + 1;
    const hashtagsText = parsed.hashtags.join(" ");

    await prisma.generatedCaption.createMany({
      data: parsed.captions.map((caption) => ({
        movieLogId: logId,
        tone: caption.tone as CaptionTone,
        captionText: caption.captionText,
        hashtagsText,
        versionNo: nextVersionNo,
      })),
    });

    revalidatePath(`/logs/${logId}`);
    revalidatePath("/logs");

    return { ok: true, message: "인스타그램용 캡션 3종을 생성했습니다." };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "캡션 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }
}

import type { CaptionGenerationRequest } from "@/features/captions/types/caption-generation";

export const CAPTION_GENERATION_SCHEMA = {
  name: "instagram_caption_bundle",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      captions: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            tone: {
              type: "string",
              enum: ["CALM", "EMOTIONAL", "REVIEW"],
            },
            captionText: {
              type: "string",
            },
          },
          required: ["tone", "captionText"],
        },
      },
      hashtags: {
        type: "array",
        minItems: 5,
        maxItems: 8,
        items: {
          type: "string",
        },
      },
    },
    required: ["captions", "hashtags"],
  },
} as const;

function formatOptional(label: string, value: string | number | null) {
  return `${label}: ${value ?? "없음"}`;
}

export function buildCaptionGenerationPrompt(input: CaptionGenerationRequest) {
  return [
    "당신은 한국어 인스타그램용 영화 기록 캡션 작성 도우미다.",
    "반드시 사용자의 실제 입력만 사용하고, 없는 내용은 추측하지 않는다.",
    "과장하거나 꾸미지 말고 자연스럽게 쓴다.",
    "스포일러는 절대 포함하지 않는다.",
    "문장은 너무 길지 않게 쓴다.",
    "세 가지 톤은 분명히 달라야 한다.",
    "CALM은 담백한 기록형, EMOTIONAL은 감성형, REVIEW는 짧은 리뷰형이다.",
    "해시태그는 5개 이상 8개 이하로 작성한다.",
    "해시태그는 한국어 위주로, 과도하게 길지 않게 작성한다.",
    "",
    formatOptional("영화 제목", input.title),
    formatOptional("관람일", input.watchedAt),
    formatOptional("관람 장소", input.watchPlace),
    formatOptional("관람 방식", input.watchMethod),
    formatOptional("별점", input.rating),
    formatOptional("한줄 감상", input.shortReview),
    formatOptional("스포일러 여부", input.isSpoiler ? "있음" : "없음"),
  ].join("\n");
}

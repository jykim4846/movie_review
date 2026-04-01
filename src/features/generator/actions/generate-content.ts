"use server";

import Groq from "groq-sdk";
import { env } from "@/lib/env";

export type GeneratedPost = {
  caption: string;
  hashtags: string;
};

type GenerateInput = {
  type: "movie" | "book";
  title: string;
  authors?: string[];
  count: number;
  date: string;
  method: string;
  rating: number | null;
  emotions: string;
  memo: string;
};

type GenerateResult =
  | { ok: true; post: GeneratedPost }
  | { ok: false; message: string };

function ordinalKorean(n: number): string {
  const units = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열"];
  const tens = ["", "열", "스물", "서른", "마흔", "쉰", "예순", "일흔", "여든", "아흔"];
  if (n <= 0) return `${n}`;
  if (n < 11) return `${units[n]}번째`;
  const t = Math.floor(n / 10);
  const u = n % 10;
  return `${tens[t] ?? ""}${u > 0 ? units[u] : ""}번째`;
}

export async function generateContent(input: GenerateInput): Promise<GenerateResult> {
  if (!env.groqApiKey) {
    return { ok: false, message: "GROQ_API_KEY가 설정되지 않았습니다." };
  }

  const kind = input.type === "movie" ? "영화" : "책";
  const ordinal = ordinalKorean(input.count);
  const titleLine = `${kind} 소감 끄적이기 ${ordinal}`;

  const prompt = [
    `당신은 한국 20~30대 sns 사용자다. 인스타그램에 ${kind} 소감을 올리는 글을 쓰고 있다.`,
    "말투는 일상적이고 자연스럽게, 과장 없이 솔직하게 쓴다.",
    "문어체가 아닌 구어체에 가깝게, 친구에게 이야기하듯 쓴다.",
    "짧은 문장 여러 개로 나누어 쓴다. 줄바꿈을 자주 사용한다.",
    "없는 내용은 절대 지어내지 않는다. 주어진 정보만 사용한다.",
    `마지막 줄은 반드시 '개인적인 평가: ${input.rating ?? "??"} / 5' 형식으로 끝낸다.`,
    "해시태그는 4~8개, 한국어 위주로, 책/영화 제목 포함한다.",
    "",
    `[${kind} 제목] ${input.title}`,
    input.authors?.length ? `[저자] ${input.authors.join(", ")}` : "",
    `[${input.type === "movie" ? "관람일" : "읽은 날짜"}] ${input.date}`,
    `[${input.type === "movie" ? "관람 방식" : "읽은 방식"}] ${input.method}`,
    `[별점] ${input.rating ?? "없음"} / 5`,
    `[느낀 감정 키워드] ${input.emotions}`,
    input.memo ? `[추가 메모] ${input.memo}` : "",
  ].filter(Boolean).join("\n");

  try {
    const groq = new Groq({ apiKey: env.groqApiKey });
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: '반드시 JSON 형식으로만 응답한다. {"body": "본문 내용", "hashtags": ["#태그1", "#태그2"]} 형식으로만 출력한다. 다른 텍스트나 코드블록 없이 JSON만 출력한다.',
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return { ok: false, message: "응답을 해석하지 못했습니다." };

    const parsed = JSON.parse(content) as { body: string; hashtags: string[] };
    const hashtagsText = parsed.hashtags.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ");
    const caption = [titleLine, "", parsed.body, "", hashtagsText].join("\n");

    return { ok: true, post: { caption, hashtags: hashtagsText } };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "생성 중 오류가 발생했습니다." };
  }
}

import { SectionCard } from "@/components/common/section-card";

const todoItems = [
  "영화 기록 수정 기능",
  "TMDB 기반 영화 검색 보조",
  "OpenAI 캡션 생성 서버 액션 또는 API Route",
  "카드 이미지 저장 기능",
  "캡션 히스토리 관리 개선",
];

export function RoadmapPreview() {
  return (
    <SectionCard
      title="다음 단계 미리보기"
      description="지금은 구현하지 않지만, 다음 단계에서 이어질 기능을 명확히 남겨둡니다."
    >
      <ol className="grid gap-3 sm:grid-cols-2">
        {todoItems.map((item, index) => (
          <li
            key={item}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
          >
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-300/15 text-xs font-bold text-amber-200">
              {index + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}

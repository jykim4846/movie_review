import { SectionCard } from "@/components/common/section-card";

const overviewItems = [
  {
    title: "영화 기록",
    description: "관람일, 장소, 별점, 한줄 감상, 긴 리뷰를 저장하는 핵심 기능",
  },
  {
    title: "인스타 캡션 초안",
    description: "한줄 감상을 기반으로 OpenAI API를 사용해 캡션 초안을 생성할 준비",
  },
  {
    title: "카드 이미지 저장 예정",
    description: "추후 이미지 렌더링과 저장 기능을 붙일 수 있도록 구조를 분리",
  },
];

export function FeatureOverview() {
  return (
    <SectionCard
      title="MVP에서 다루는 것"
      description="이번 버전은 실제 기능 구현 전, 뼈대를 안정적으로 세우는 단계입니다."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {overviewItems.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <h3 className="text-base font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}

export function HeroSection() {
  return (
    <section className="card-surface overflow-hidden">
      <div className="grid gap-6 px-5 py-8 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            개인 영화 아카이브
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            본 영화의 시간과 감상을
            <br />
            한 곳에 남기는 MVP
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            사용자가 영화 제목, 관람일, 관람 장소, 한줄 감상, 긴 리뷰를 기록하고
            그 내용을 바탕으로 인스타그램용 캡션 초안을 생성할 수 있는 웹앱의 시작점입니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
              모바일 우선 UI
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
              App Router
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
              Prisma 준비 완료
            </span>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-sm font-semibold text-white">이번 단계 범위</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <li>홈 랜딩 페이지</li>
            <li>공통 레이아웃</li>
            <li>Prisma 연결 준비</li>
            <li>기능별 디렉터리 구조</li>
            <li>실제 기록/캡션 생성 기능은 이후 단계</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

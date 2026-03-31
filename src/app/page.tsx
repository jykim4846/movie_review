import { FeatureOverview } from "@/features/home/components/feature-overview";
import { HeroSection } from "@/features/home/components/hero-section";
import { RoadmapPreview } from "@/features/home/components/roadmap-preview";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <HeroSection />
      <FeatureOverview />
      <RoadmapPreview />
    </main>
  );
}

import { HeroSection } from "@/components/homepage/HeroSection";
import { FeaturesSection } from "@/components/homepage/FeaturesSection";
import { DemoPreview } from "@/components/homepage/DemoPreview";
import { ScienceCategories } from "@/components/homepage/ScienceCategories";
import { ExperimentExplorer } from "@/components/homepage/ExperimentExplorer";
import { AIInstructorPreview } from "@/components/homepage/AIInstructorPreview";
import { CallToAction } from "@/components/homepage/CallToAction";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <DemoPreview />
      <ScienceCategories />
      <ExperimentExplorer />
      <AIInstructorPreview />
      <CallToAction />
    </main>
  );
}

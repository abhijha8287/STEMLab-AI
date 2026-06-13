"use client";

import { Map, Share2, GitMerge, Search } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function ConceptExplorerPage() {
  return (
    <ComingSoon
      icon={Map}
      title="Concept Explorer"
      phase="Phase 7"
      description="Navigate an interactive knowledge graph of 46+ STEM concepts across Physics, Chemistry, and Mathematics. Discover relationships, prerequisites, and see which concepts you've already explored."
      features={[
        { icon: Share2, label: "Interactive D3 knowledge graph" },
        { icon: GitMerge, label: "Prerequisite & related edges" },
        { icon: Search, label: "Search and filter by subject" },
        { icon: Map, label: "Track your exploration progress" },
      ]}
      color="purple"
    />
  );
}

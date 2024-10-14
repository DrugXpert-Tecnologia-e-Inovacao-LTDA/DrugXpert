"use client";
import dynamic from "next/dynamic";
import React from "react";

import CTACard from "./components/CTACard";
import { AtomIcon, MessageCircle, Network, SearchIcon } from "lucide-react";

const DashboardCardMap = dynamic(
  () => import("@/components/Dashboard/components/DashboardCardMap"),
  { ssr: false }
);

const DashboardCardChat = dynamic(
  () => import("@/components/Dashboard/components/DashboardCardChat"),
  { ssr: false }
);

const Index: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CTACard
          subtitle="Get access to more molecules"
          title="Molecule Bank"
          href="/molecule-bank"
        >
          <AtomIcon />
        </CTACard>

        <CTACard
          subtitle="Generate molecules easily"
          title="Generate Molecule"
          href="/model"
        >
          <Network />
        </CTACard>

        <CTACard
          subtitle="Search chemical compounds"
          title="Search Compounds"
          href="/research"
        >
          <SearchIcon />
        </CTACard>

        <CTACard
          subtitle="Collaborate with other researchers"
          title="Collaborative Research"
          href="/message"
        >
          <MessageCircle />
        </CTACard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DashboardCardChat />
        <DashboardCardMap />
      </div>
    </div>
  );
};

export default Index;

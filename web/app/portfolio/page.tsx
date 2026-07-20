"use client";
import Header from "@/component/layout/header";
import { ActionBar } from "@/component/ui/actionBar";
import Card from "@/component/ui/card";
import { PaginatedGrid } from "@/component/ui/paginationGrid";
import { sitesData } from "@/data/siteData";

export default function PortfolioPage() {
  const portfolioItems = (() => {
    const items = sitesData.filter((item) => item.tag === "Portfolio");
    const prasanjit = items.find((item) => item.id === "p16");
    if (prasanjit) {
      return [prasanjit, ...items.filter((item) => item.id !== "p16")];
    }
    return items;
  })();

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6">

      <Header
        title="Portfolios That"
        highlight="Actually Inspire."
        description="Dive into thoughtfully crafted portfolios by designers and developers.
        Discover how others tell their story — then, build your own."
      />

      <ActionBar />
      <PaginatedGrid 
        data={portfolioItems}
        itemsPerPage={15}
        renderItem={(item) => <Card key={item.id} {...item} />}
      />
    </div>
  );
}


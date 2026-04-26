"use client";

import { useState } from "react";
import Card from "@/component/ui/card";
import Header from "@/component/layout/header";
import { Container } from "@/component/ui/container";
import { sitesData } from "@/data/siteData";
import { Filters } from "@/component/ui/filter";
import { PaginatedGrid } from "@/component/ui/paginationGrid";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filteredData =
    activeFilter === "All"
      ? sitesData
      : sitesData.filter((item) => item.tag === activeFilter);

  function handleFilterChange(f: string) {
    setActiveFilter(f);
    setPage(1); // Reset to page 1 when filter changes
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10">
        <Container>
          <Header
            title="Curated Inspiration"
            highlight="For People Who Build"
            description="Design references, portfolios, and tools in one place. No more endless bookmarks,just quality resources for developers and designers."
          />

          <Filters activeFilter={activeFilter} setActiveFilter={handleFilterChange} />

          <PaginatedGrid
            data={filteredData}
            itemsPerPage={15}
            renderItem={(item) => <Card key={item.id} {...item} />}
            filterKey={activeFilter}
            currentPage={page}
            onPageChange={setPage}
          />
        </Container>
      </div>
    </div>
  );
}
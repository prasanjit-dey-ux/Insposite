"use client"

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Github, Plus, Star } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSubmitModal } from "./submitModal";

const FILTERS = ["All", "Portfolio", "Inspiration", "Tool"]

function useGithubStars(repo: string) {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}`)
      .then((r) => r.json())
      .then((d) => { if (typeof d.stargazers_count === "number") setStars(d.stargazers_count); })
      .catch(() => {});
  }, [repo]);
  return stars;
}

export const Filters = ({ activeFilter, setActiveFilter }: { activeFilter: string, setActiveFilter: (f: string) => void }) => {
  const { openModal } = useSubmitModal();
  const stars = useGithubStars("prasanjit-dey-ux/Insposite");

  return (
    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-8 mt-10 mb-10">

      {/* ── Filter pills ── */}
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
        {FILTERS.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              whileTap={{ scale: 0.95 }}
              className={clsx(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap shrink-0",
                isActive
                  ? "bg-neutral-100 text-blue-700"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              {filter}
            </motion.button>
          );
        })}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-3 flex-col sm:flex-row w-full md:w-auto">

        {/* Submit */}
        <motion.button
          onClick={openModal}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-blue-700 text-white border border-blue-600 border-t-2 border-t-blue-500 rounded-md text-sm font-medium"
        >
          <Plus size={16} strokeWidth={2.5} />
          Submit your site
        </motion.button>

        {/* GitHub */}
        <Link
          href="https://github.com/prasanjit-dey-ux/Insposite"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 border-t-2 border-t-neutral-700 text-white rounded-md text-sm font-medium"
          >
            <Github size={16} />
            GitHub
            {stars !== null && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-neutral-700/80 rounded text-xs font-mono leading-none">
                <Star size={10} fill="currentColor" strokeWidth={0} />
                {stars.toLocaleString()}
              </span>
            )}
          </motion.button>
        </Link>

      </div>
    </div>
  )
}
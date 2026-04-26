"use client";

import { useEffect, useState } from "react";
import { Github, Plus, Star } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSubmitModal } from "./submitModal";

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

export const ActionBar = () => {
  const { openModal } = useSubmitModal();
  const stars = useGithubStars("prasanjit-dey-ux/Insposite");

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 mt-10 mb-10">

      {/* ── Submit your site ── */}
      <motion.button
        onClick={openModal}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="flex justify-center items-center gap-2 px-4 py-2 bg-blue-700 text-white border border-blue-600 border-t-2 border-t-blue-500 rounded-md text-sm font-medium"
      >
        <Plus size={16} strokeWidth={2.5} />
        Submit your site
      </motion.button>

      {/* ── GitHub ── */}
      <Link
        href="https://github.com/prasanjit-dey-ux/Insposite"
        target="_blank"
        rel="noopener noreferrer"
        className="flex"
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
  );
};
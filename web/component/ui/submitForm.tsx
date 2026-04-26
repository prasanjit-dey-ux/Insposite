"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Globe, User, Tag, CheckCircle, Loader2, X, Link2 } from "lucide-react";
import clsx from "clsx";

const TAGS = ["Portfolio", "Inspiration", "Tool"];

type FormState = "idle" | "loading" | "success" | "error";

interface FormData {
  siteUrl: string;
  title: string;
  tag: string;
  creatorUrl: string;
  notes: string;
}

const initialForm: FormData = {
  siteUrl: "",
  title: "",
  tag: "",
  creatorUrl: "",
  notes: "",
};

interface SubmitFormProps {
  onClose?: () => void;
}

export function SubmitForm({ onClose }: SubmitFormProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [errorMessage, setErrorMessage] = useState("Something went wrong — please try again.");
  const [honeypot, setHoneypot] = useState(""); // bot trap;

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};
    if (!form.siteUrl.trim()) newErrors.siteUrl = "Site URL is required.";
    else if (!/^https?:\/\//.test(form.siteUrl))
      newErrors.siteUrl = "Must be a valid URL (https://…)";
    if (!form.title.trim()) newErrors.title = "Site title is required.";
    if (!form.tag) newErrors.tag = "Please pick a category.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setFormState("loading");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error ?? "Something went wrong — please try again.");
        throw new Error("Server error");
      }
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  function handleReset() {
    setForm(initialForm);
    setErrors({});
    setFormState("idle");
  }

  const inputBase =
    "w-full px-3.5 py-2.5 rounded-md border text-sm font-medium text-neutral-900 placeholder:text-neutral-400 bg-white transition-all duration-150 outline-none focus:ring-2 focus:ring-blue-700/30 focus:border-blue-700";

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 flex items-center gap-2">
            <div className="bg-blue-700 size-5 flex justify-end items-baseline-last shrink-0">
              <div className="rounded-full size-2.5 bg-white" />
            </div>
            Submit Your Site
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Share a resource worth curating — portfolio, tool, or inspiration.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 transition-colors mt-0.5"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {formState === "success" ? (
          /* ── Success state ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-12 text-center"
          >
            <div className="bg-blue-700/10 rounded-full p-4">
              <CheckCircle className="text-blue-700" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Thanks for the submission!
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                We&apos;ll review it and add it to the collection soon.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleReset}
              className="mt-2 px-4 py-2 rounded-md bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              Submit another site
            </motion.button>
          </motion.div>
        ) : (
          /* ── Form ── */
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Honeypot — hidden from humans, bots fill it and get silently blocked */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ display: "none" }}
            />
            {/* Site URL */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="siteUrl"
                className="text-sm font-medium text-neutral-700 flex items-center gap-1.5"
              >
                <Globe size={14} className="text-blue-700" />
                Site URL <span className="text-blue-700">*</span>
              </label>
              <input
                id="siteUrl"
                type="url"
                placeholder="https://yoursite.com"
                value={form.siteUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, siteUrl: e.target.value }))
                }
                className={clsx(
                  inputBase,
                  errors.siteUrl
                    ? "border-red-400 focus:ring-red-400/30 focus:border-red-400"
                    : "border-slate-300"
                )}
              />
              {errors.siteUrl && (
                <p className="text-xs text-red-500">{errors.siteUrl}</p>
              )}
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="title"
                className="text-sm font-medium text-neutral-700 flex items-center gap-1.5"
              >
                <User size={14} className="text-blue-700" />
                Site Name <span className="text-blue-700">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Linear, Stripe, Rauno's portfolio"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className={clsx(
                  inputBase,
                  errors.title
                    ? "border-red-400 focus:ring-red-400/30 focus:border-red-400"
                    : "border-slate-300"
                )}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                <Tag size={14} className="text-blue-700" />
                Category <span className="text-blue-700">*</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {TAGS.map((t) => (
                  <motion.button
                    type="button"
                    key={t}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setForm((f) => ({ ...f, tag: t }))}
                    className={clsx(
                      "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                      form.tag === t
                        ? "bg-blue-700 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    )}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>
              {errors.tag && (
                <p className="text-xs text-red-500">{errors.tag}</p>
              )}
            </div>

            {/* Social Link */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="creatorUrl"
                className="text-sm font-medium text-neutral-700 flex items-center gap-1.5"
              >
                <Link2 size={14} className="text-neutral-500" />
                Social Link
                <span className="ml-1 text-xs font-normal text-neutral-400">
                  (X, GitHub, portfolio, etc. — optional)
                </span>
              </label>
              <input
                id="creatorUrl"
                type="url"
                placeholder="https://x.com/yourusername"
                value={form.creatorUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, creatorUrl: e.target.value }))
                }
                className={clsx(inputBase, "border-slate-300")}
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="notes"
                className="text-sm font-medium text-neutral-700"
              >
                Why should we feature it?
                <span className="ml-1 text-xs font-normal text-neutral-400">
                  (optional)
                </span>
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="What makes this site worth curating?"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                className={clsx(
                  inputBase,
                  "border-slate-300 resize-none leading-relaxed"
                )}
              />
            </div>



            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <motion.button
                type="submit"
                disabled={formState === "loading"}
                whileHover={formState !== "loading" ? { opacity: 0.92 } : {}}
                whileTap={formState !== "loading" ? { scale: 0.985 } : {}}
                className={clsx(
                  "flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                  formState === "loading"
                    ? "bg-blue-700/70 text-white cursor-not-allowed"
                    : "bg-blue-700 text-white border border-blue-600 hover:bg-blue-800"
                )}
              >
                {formState === "loading" ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Plus size={15} strokeWidth={2.5} />
                    Submit your site
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ opacity: 0.75 }}
                whileTap={{ scale: 0.985 }}
                onClick={handleReset}
                className="px-4 py-2.5 rounded-md bg-neutral-100 text-neutral-600 text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                Clear
              </motion.button>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {formState === "error" && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-500 text-center"
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

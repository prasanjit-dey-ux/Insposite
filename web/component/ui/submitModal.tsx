"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { SubmitForm } from "./submitForm";

// ── Context ─────────────────────────────────────────────────────────────────

interface ModalCtx {
  openModal: () => void;
}

const SubmitModalContext = createContext<ModalCtx>({ openModal: () => {} });

export function useSubmitModal() {
  return useContext(SubmitModalContext);
}

// ── Provider + Modal ─────────────────────────────────────────────────────────

export function SubmitModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <SubmitModalContext.Provider value={{ openModal }}>
      {children}

      <AnimatePresence>
        {open && (
          <>
            {/* ── Backdrop ── */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
              aria-hidden="true"
            />

            {/* ── Modal card ── */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4"
            >
              <div
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 pointer-events-auto max-h-[92vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Form (handles its own close button via onClose prop) */}
                <div className="px-7 py-7">
                  <SubmitForm onClose={closeModal} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SubmitModalContext.Provider>
  );
}

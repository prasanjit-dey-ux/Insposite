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

            {/* ── Modal ── */}
            {/* Mobile: bottom sheet sliding up | Desktop: centered card */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:pointer-events-none pointer-events-auto"
            >
              <div
                className="
                  relative w-full bg-white
                  rounded-t-2xl sm:rounded-2xl
                  shadow-2xl ring-1 ring-slate-200
                  sm:max-w-lg sm:pointer-events-auto
                  max-h-[92vh] overflow-y-auto
                "
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag handle – mobile only */}
                <div className="sm:hidden flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-neutral-300" />
                </div>

                {/* Form */}
                <div className="px-4 py-4 sm:px-7 sm:py-7">
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

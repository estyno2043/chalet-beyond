/*
 * CHALET BEYOND — language dropdown.
 *
 * The current language (flag + code) opens a short menu with the other three.
 * It is its own menu, separate from the burger — a guest who only wants to
 * switch language should not have to open the whole navigation to find it.
 * Desktop uses it too: one control reads calmer than a row of four flags.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { LANGS, LANG_NAMES, type Lang } from "@shared/i18n";
import { FLAGS } from "@/i18n/flags";
import { useLang } from "@/i18n/LanguageProvider";
import { useLanguageNavigate } from "@/hooks/useLanguageNavigate";

export function LanguageDropdown({ className = "" }: { className?: string }) {
  const current = useLang();
  const go = useLanguageNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const CurrentFlag = FLAGS[current];

  const choose = (lang: Lang) => {
    setOpen(false);
    go(lang);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(wasOpen => !wasOpen)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${current.toUpperCase()} — ${LANG_NAMES[current]}`}
        className="h-11 flex items-center justify-center gap-2 rounded-full px-4 active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgb(245 244 239 / 0.24), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
          background: open ? "rgb(245 244 239 / 0.12)" : "transparent",
          color: "oklch(0.97 0.007 75)",
          fontFamily: "var(--font-body-family)",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
        }}
      >
        <CurrentFlag />
        <span aria-hidden="true">{current.toUpperCase()}</span>
        <ChevronDown
          size={11}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 180ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
      </button>

      {/* Origin-aware popover: scales from trigger (top-right anchor) */}
      <AnimatePresence>
        {open && (
          <m.div
            role="menu"
            aria-label="Language"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-full mt-2 overflow-hidden rounded-xl"
            style={{
              minWidth: "11rem",
              zIndex: 60,
              transformOrigin: "top right",
              background: "oklch(0.09 0.012 55 / 0.96)",
              backdropFilter: "blur(20px) saturate(160%)",
              WebkitBackdropFilter: "blur(20px) saturate(160%)",
              border: "1px solid oklch(0.72 0.12 65 / 0.28)",
              boxShadow:
                "0 18px 40px -8px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
            }}
          >
            {LANGS.map(lang => {
              const Flag = FLAGS[lang];
              const active = lang === current;
              return (
                <button
                  key={lang}
                  type="button"
                  role="menuitem"
                  onClick={() => choose(lang)}
                  className="w-full flex items-center gap-2.5 px-3.5 transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[oklch(0.18_0.015_55/0.8)] active:scale-[0.98]"
                  style={{
                    minHeight: "2.75rem",
                    fontFamily: "var(--font-body-family)",
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 400,
                    textAlign: "left",
                    color: active ? "var(--amber)" : "oklch(0.85 0.012 75)",
                    background: active ? "oklch(0.72 0.12 65 / 0.12)" : "transparent",
                    borderBottom: "1px solid rgb(245 244 239 / 0.06)",
                  }}
                >
                  <Flag />
                  <span>{LANG_NAMES[lang]}</span>
                </button>
              );
            })}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

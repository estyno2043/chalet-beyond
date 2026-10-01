/*
 * CHALET BEYOND — language dropdown.
 *
 * The current language (flag + code) opens a short menu with the other three.
 * It is its own menu, separate from the burger — a guest who only wants to
 * switch language should not have to open the whole navigation to find it.
 * Desktop uses it too: one control reads calmer than a row of four flags.
 */
import { useEffect, useRef, useState } from "react";
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
      // Escape without this leaves focus on a button that is no longer
      // meaningful, which strands anyone navigating by keyboard.
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
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${LANG_NAMES[current]} — ${LANGS.length} jazykov`}
        className="h-11 flex items-center justify-center gap-2 rounded-full px-4"
        style={{
          boxShadow: "inset 0 0 0 1px rgb(245 244 239 / 0.24)",
          background: open ? "rgb(245 244 239 / 0.08)" : "transparent",
          color: "oklch(0.97 0.007 75)",
          fontFamily: "var(--font-body-family)",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          transition: "background var(--motion-ui) var(--ease-ui)",
        }}
      >
        <CurrentFlag />
        <span aria-hidden="true">{current.toUpperCase()}</span>
        <ChevronDown
          size={11}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform var(--motion-ui) var(--ease-ui)",
          }}
        />
      </button>

      {/* Right-aligned: the trigger sits at the right edge of the bar, so a
          left-aligned panel would hang off the screen on a narrow phone. */}
      <div
        role="menu"
        aria-label="Language"
        hidden={!open}
        className="absolute right-0 top-full mt-2 overflow-hidden rounded-xl"
        style={{
          minWidth: "11rem",
          zIndex: 60,
          background: "oklch(0.08 0.010 55 / 0.98)",
          border: "1px solid rgb(245 244 239 / 0.14)",
          boxShadow: "0 12px 32px rgb(0 0 0 / 0.45)",
        }}
      >
        {LANGS.map((lang) => {
          const Flag = FLAGS[lang];
          const active = lang === current;
          return (
            <button
              key={lang}
              type="button"
              role="menuitem"
              onClick={() => choose(lang)}
              className="w-full flex items-center gap-2.5 px-3"
              style={{
                minHeight: "2.75rem",
                fontFamily: "var(--font-body-family)",
                fontSize: "0.875rem",
                fontWeight: active ? 600 : 400,
                textAlign: "left",
                color: active ? "oklch(0.97 0.007 75)" : "oklch(0.78 0.015 70)",
                background: active ? "rgb(245 244 239 / 0.08)" : "transparent",
                borderBottom: "1px solid rgb(245 244 239 / 0.06)",
              }}
            >
              <Flag />
              <span>{LANG_NAMES[lang]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

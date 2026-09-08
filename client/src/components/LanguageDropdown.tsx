/*
 * CHALET BEYOND — language dropdown for the mobile bar.
 *
 * The flag of the current language sits next to the burger; tapping it opens a
 * short menu underneath with the other three. This is its own menu, separate
 * from the burger — a guest who only wants to switch language should not have
 * to open the whole navigation to find it.
 *
 * The inline row of four flags stays on desktop, where there is room for it.
 */
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LANGS, LANG_NAMES, type Lang } from "@shared/i18n";
import { FLAGS } from "@/i18n/flags";
import { useLang } from "@/i18n/LanguageProvider";
import { useLanguageNavigate } from "@/components/LanguageSwitcher";

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
        className="w-11 h-11 flex items-center justify-center gap-1 rounded-sm"
        style={{
          border: "1px solid rgba(180,120,40,0.25)",
          background: open ? "rgba(180,120,40,0.10)" : "transparent",
          color: "oklch(0.72 0.12 65)",
          transition: "background var(--motion-ui) var(--ease-ui)",
        }}
      >
        <CurrentFlag />
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
        className="absolute right-0 top-full mt-2 overflow-hidden rounded-sm"
        style={{
          minWidth: "11rem",
          zIndex: 60,
          background: "oklch(0.08 0.010 55 / 0.98)",
          border: "1px solid rgba(180,120,40,0.25)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
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
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textAlign: "left",
                color: active ? "oklch(0.92 0.008 75)" : "oklch(0.62 0.020 65)",
                background: active ? "rgba(180,120,40,0.12)" : "transparent",
                borderBottom: "1px solid rgba(180,120,40,0.08)",
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

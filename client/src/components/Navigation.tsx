/**
 * Navigation — Chalet Beyond
 * Based on header-2 pattern (sshahaider/header-2)
 * Design: Nordic Brutalism / Dark Timber
 * - Fixed height, transparent over hero → solid dark on scroll
 * - Shares the hero's responsive gutters
 * - Amber accent on active/hover links with underline reveal
 * - Animated hamburger icon (MenuToggleIcon) for mobile
 * - Mobile menu: full-screen overlay with zoom-in/out animation
 */
import React from "react";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScrollThreshold } from "@/components/ui/use-scroll";
import { useT } from "@/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import "./navigation.css";

const HREFS = [
  "#chalet",
  "#priestory",
  "#okolie",
  "#cennik",
  "#rezervacia",
] as const;

export function Navigation() {
  const t = useT();
  const links = [
    { label: t.nav.chalet, href: HREFS[0] },
    { label: t.nav.priestory, href: HREFS[1] },
    { label: t.nav.okolie, href: HREFS[2] },
    { label: t.nav.cennik, href: HREFS[3] },
    { label: t.nav.rezervacia, href: HREFS[4] },
  ];
  const [open, setOpen] = React.useState(false);
  const scrolled = useScrollThreshold(10);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLinkClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el)
      el.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
  };

  return (
    <header
      className={cn(
        "chalet-navigation fixed top-0 left-0 right-0 z-[100] mx-auto w-full transition-colors duration-200",
        {
          // Scrolled: solid contrast without a backdrop blur
          "bg-[oklch(0.08_0.010_55/0.97)] border-b border-[rgba(180,120,40,0.15)]":
            scrolled && !open,
          // Mobile menu open: solid dark
          "bg-[oklch(0.06_0.008_55/0.98)]": open,
          // Default: fully transparent
          "bg-transparent border-b border-transparent": !scrolled && !open,
        }
      )}
    >
      <div
        className={cn(
          "chalet-navigation__inner mx-auto flex items-center justify-between"
        )}
      >
        {/* Logo / SVG Mark */}
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "auto"
                : "smooth",
            });
            setOpen(false);
          }}
          className="flex items-center gap-2.5 select-none group"
          aria-label={t.nav.home}
        >
          {/* Brand logo (image) */}
          <img
            src="/logo-nav.png"
            alt="Chalet Beyond"
            width={96}
            height={96}
            className="flex-shrink-0 w-auto select-none"
            style={{ height: "44px", objectFit: "contain" }}
          />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 xl:flex">
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={e => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className={cn(
                "relative inline-flex min-h-11 items-center px-3 py-1.5 text-sm font-medium",
                "text-[oklch(0.92_0.008_75)] hover:text-[oklch(0.82_0.08_75)]",
                "transition-colors duration-200",
                "after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px",
                "after:bg-[oklch(0.72_0.12_65)] after:scale-x-0 after:origin-left",
                "after:transition-transform after:duration-300 after:ease-out",
                "hover:after:scale-x-100"
              )}
              style={{ fontFamily: "'Karla', sans-serif" }}
            >
              {link.label}
            </a>
          ))}

          <div className="ml-2 mr-1">
            <LanguageSwitcher />
          </div>

          {/* CTA button */}
          <a
            href="#rezervacia"
            onClick={e => {
              e.preventDefault();
              handleLinkClick("#rezervacia");
            }}
            className={cn(
              "chalet-navigation__book ml-3 inline-flex min-h-11 items-center px-5 py-2 text-sm font-semibold"
            )}
            style={{
              fontFamily: "'Karla', sans-serif",
              background: "oklch(0.72 0.12 65)",
              color: "oklch(0.10 0.010 55)",
            }}
          >
            {t.nav.book}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={cn(
            "xl:hidden flex items-center justify-center w-11 h-11 rounded-sm",
            "border border-[rgba(180,120,40,0.25)] bg-transparent",
            "text-[oklch(0.92_0.008_75)]",
            "transition-colors duration-200",
            "hover:border-[rgba(180,120,40,0.5)] hover:bg-[rgba(180,120,40,0.08)]",
            "active:scale-95"
          )}
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </button>
      </div>

      {/* Mobile full-screen menu overlay — simple fade+lift, no tw-animate-css. */}
      <div
        inert={!open}
        aria-hidden={!open}
        className={cn(
          "fixed right-0 bottom-0 left-0 z-50 flex flex-col overflow-y-auto xl:hidden",
          "border-t border-[rgba(180,120,40,0.15)]",
          "bg-[oklch(0.06_0.008_55/0.98)]",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        style={{
          top: "72px",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        <div className="flex h-full w-full flex-col justify-between gap-y-2 p-6">
          <div className="grid gap-y-1 pt-4">
            {links.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={cn(
                  "flex items-center px-4 py-4 text-left",
                  "border-b border-[rgba(180,120,40,0.08)]",
                  "text-[oklch(0.75_0.015_65)] hover:text-[oklch(0.92_0.008_75)]",
                  "transition-colors duration-200"
                )}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "2rem",
                  letterSpacing: "0.1em",
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: "oklch(0.62 0.10 65)",
                    letterSpacing: "0.2em",
                    marginRight: "1rem",
                    opacity: 0.7,
                  }}
                >
                  0{i + 1}
                </span>
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 pb-8">
            <div className="pb-2">
              <LanguageSwitcher compact />
            </div>
            <a
              href="#rezervacia"
              onClick={e => {
                e.preventDefault();
                handleLinkClick("#rezervacia");
              }}
              className="w-full flex items-center justify-center py-4 rounded-sm text-center"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.2rem",
                letterSpacing: "0.12em",
                background:
                  "linear-gradient(180deg, oklch(0.72 0.12 65) 0%, oklch(0.60 0.10 60) 100%)",
                color: "oklch(0.10 0.010 55)",
                boxShadow:
                  "0 0 0 1px rgba(180,120,40,0.3), 0 4px 16px rgba(180,120,40,0.3)",
              }}
            >
              {t.nav.bookStay}
            </a>
            <a
              href="mailto:contact@chaletbeyond.sk"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center py-4 rounded-sm text-center"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.2rem",
                letterSpacing: "0.12em",
                color: "oklch(0.72 0.12 65)",
                border: "1px solid rgba(180,120,40,0.3)",
              }}
            >
              {t.nav.writeUs}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

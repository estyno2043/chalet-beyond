/**
 * Navigation — Chalet Beyond
 * Design: Nordic Brutalism / Dark Timber & Brass
 * - Transparent over the hero → solid dark timber once the page scrolls
 * - Live Jasná mountain weather & coordinates status beacon
 * - Central high-conversion capacity & price teaser with instant booking link
 * - Always accessible luxury reservation CTA
 * - Mobile-first weather chip, responsive controls, and elevated drawer
 */
import React from "react";
import { AnimatePresence, m } from "framer-motion";
import { usePastHero } from "@/hooks/usePastHero";
import { ArrowRight, Cloud, CloudRain, Mail, Phone, Snowflake, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScrollThreshold } from "@/components/ui/use-scroll";
import { useT } from "@/i18n/LanguageProvider";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { RollLink } from "@/components/RollButton";
import { useJasnaWeather, type WeatherIconType } from "@/hooks/useJasnaWeather";
import { EMAIL, PHONE, PHONE_DISPLAY, WHATSAPP_URL } from "@shared/contact";
import "./navigation.css";

const HREFS = [
  "#chalet",
  "#priestory",
  "#vybavenie",
  "#okolie",
  "#cennik",
  "#rezervacia",
] as const;

function WeatherIcon({ type, className }: { type: WeatherIconType; className?: string }) {
  switch (type) {
    case "snow":
      return <Snowflake className={className} strokeWidth={1.75} aria-hidden="true" />;
    case "sun":
      return <Sun className={className} strokeWidth={1.75} aria-hidden="true" />;
    case "rain":
      return <CloudRain className={className} strokeWidth={1.75} aria-hidden="true" />;
    case "cloud":
    default:
      return <Cloud className={className} strokeWidth={1.75} aria-hidden="true" />;
  }
}

export function Navigation() {
  const t = useT();
  const weather = useJasnaWeather();
  const links = [
    { label: t.nav.chalet, href: HREFS[0] },
    { label: t.nav.priestory, href: HREFS[1] },
    { label: "Vybavenie", href: HREFS[2] },
    { label: t.nav.okolie, href: HREFS[3] },
    { label: t.nav.cennik, href: HREFS[4] },
    { label: t.nav.rezervacia, href: HREFS[5] },
  ];
  const [open, setOpen] = React.useState(false);
  const scrolled = useScrollThreshold(10);
  const pastHero = usePastHero();

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const scrollToHref = (href: string) => {
    setOpen(false);
    void import("@/lib/smooth-scroll").then(m => m.scrollTo(href));
  };

  const bookButton = (className: string) => (
    <RollLink
      href="#rezervacia"
      onClick={e => {
        e.preventDefault();
        scrollToHref("#rezervacia");
      }}
      tone="solid"
      size="sm"
      className={cn("chalet-navigation__book", className)}
    >
      {t.nav.checkAvailability}
    </RollLink>
  );

  return (
    <header
      className="chalet-navigation"
      data-scrolled={scrolled && !open}
      data-open={open}
      data-past-hero={pastHero}
    >
      {/* Top Edge Infinite Running Promo Ticker (Hero initial only) */}
      {!pastHero && !scrolled && (
        <a
          href="#rezervacia"
          onClick={e => {
            e.preventDefault();
            scrollToHref("#rezervacia");
          }}
          className="chalet-promo-ticker"
          title="Prejsť na výber termínu so zľavou 20 %"
        >
          <div className="chalet-promo-ticker__track">
            <div className="chalet-promo-ticker__content">
              <span>{t.nav.ticker}</span>
              <span>{t.nav.ticker}</span>
            </div>
            <div className="chalet-promo-ticker__content" aria-hidden="true">
              <span>{t.nav.ticker}</span>
              <span>{t.nav.ticker}</span>
            </div>
          </div>
        </a>
      )}

      <div className="chalet-navigation__inner mx-auto flex items-center justify-between">
        
        {/* Left Cluster: Brand Logo + Architectural Coordinates & Live Weather */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              void import("@/lib/smooth-scroll").then(m => m.scrollTo(0));
              setOpen(false);
            }}
            className="chalet-navigation__logo"
            aria-label={t.nav.home}
          >
            <img
              src="/logo-light-v1.png"
              alt="Chalet Beyond"
              width={195}
              height={144}
            />
          </a>

          {/* Desktop status beacon */}
          <div className="chalet-navigation__meta hidden xl:flex items-center">
            <span className="chalet-navigation__divider" aria-hidden="true">|</span>
            <div className="chalet-navigation__status-beacon" title={weather.summary}>
              <span className="chalet-navigation__pulse-dot" aria-hidden="true" />
              <span className="chalet-navigation__location font-mono">JASNÁ · 1 220 M N.M.</span>
              <div className="chalet-navigation__weather-chip font-mono">
                <WeatherIcon type={weather.conditionIcon} className="size-3.5 text-[var(--nav-amber)]" />
                <span>{weather.tempString ?? "Jasná"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Promo announcement only on Hero */}
        <div className="chalet-navigation__center-switcher hidden xl:flex items-center">
          <AnimatePresence>
            {!pastHero && (
              <m.a
                key="promo"
                href="#rezervacia"
                onClick={e => {
                  e.preventDefault();
                  scrollToHref("#rezervacia");
                }}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                className="chalet-navigation__center-teaser group"
                title="Prejsť na výber termínu v kalendári"
              >
                <span className="chalet-navigation__teaser-badge font-mono">NOVEMBER −20 %</span>
                <span className="chalet-navigation__teaser-sep">·</span>
                <span className="chalet-navigation__teaser-highlight font-mono">SÚKROMNÝ CHALET S WELLNESSOM</span>
                <span className="chalet-navigation__teaser-sep">·</span>
                <span className="chalet-navigation__teaser-price font-mono">OD 240 € / NOC</span>
              </m.a>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop (xl) Right Actions: Phone (fades in past hero), Language, Luxury CTA */}
        <div className="chalet-navigation__actions hidden items-center xl:flex">
          <AnimatePresence>
            {pastHero && (
              <m.div
                key="contact-phone"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
                className="chalet-navigation__contact flex items-center"
              >
                <a
                  href={`tel:${PHONE}`}
                  className="chalet-navigation__phone"
                  aria-label={`${t.contact.callAria} ${PHONE_DISPLAY}`}
                >
                  <Phone size={13} strokeWidth={1.8} aria-hidden="true" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
              </m.div>
            )}
          </AnimatePresence>
          <LanguageDropdown />
          {bookButton("chalet-navigation__book--desktop")}
        </div>

        {/* Compact cluster — Mobile and Tablet (below xl) */}
        <div className="chalet-navigation__actions flex items-center xl:hidden gap-2">
          {/* Mobile live weather chip */}
          <div
            className="chalet-navigation__mobile-weather flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px]"
            title={weather.summary}
          >
            <span className="chalet-navigation__pulse-dot" aria-hidden="true" />
            <WeatherIcon type={weather.conditionIcon} className="size-3 text-[var(--nav-amber)]" />
            <span className="text-[var(--nav-ink)] tracking-wider">
              {weather.tempString ?? "1 220m"}
            </span>
          </div>

          <LanguageDropdown />
          {bookButton("chalet-navigation__book--compact")}
          <button
            type="button"
            aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="chalet-navigation__burger"
          >
            <MenuToggleIcon open={open} className="size-5" duration={300} />
          </button>
        </div>
      </div>

      {/* Menu overlay — Architectural Drawer below xl */}
      <div
        inert={!open}
        aria-hidden={!open}
        className="chalet-navigation__menu xl:hidden"
        data-open={open}
      >
        <div className="flex h-full w-full flex-col justify-between gap-y-4 p-6 sm:p-8">
          
          <div>
            {/* Top drawer architectural metadata */}
            <div className="chalet-navigation__menu-top flex items-center justify-between pb-4 border-b border-[var(--nav-line)]">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--nav-amber)]">
                <span className="chalet-navigation__pulse-dot" aria-hidden="true" />
                <span>JASNÁ · 1 220 M N.M.</span>
              </div>
              {weather.tempString && (
                <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--nav-ink)] opacity-85">
                  <WeatherIcon type={weather.conditionIcon} className="size-3.5 text-[var(--nav-amber)]" />
                  <span>{weather.tempString}</span>
                </div>
              )}
            </div>

            {/* Numerated editorial menu links */}
            <div className="grid pt-4 gap-y-1">
              {links.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => {
                    e.preventDefault();
                    scrollToHref(link.href);
                  }}
                  className="chalet-navigation__menu-link group"
                  style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
                >
                  <span className="chalet-navigation__menu-num font-mono text-xs text-[var(--nav-amber)] opacity-70 group-hover:opacity-100 transition">
                    0{i + 1}
                  </span>
                  <span className="chalet-navigation__menu-label">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick contact and reservation actions */}
          <div className="chalet-navigation__menu-actions flex flex-col gap-3 pt-6 border-t border-[var(--nav-line)]">
            <RollLink
              href="#rezervacia"
              onClick={e => {
                e.preventDefault();
                scrollToHref("#rezervacia");
              }}
              tone="solid"
              size="lg"
              className="chalet-navigation__menu-primary w-full justify-center"
            >
              {t.nav.bookStay}
            </RollLink>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <a
                href={`tel:${PHONE}`}
                aria-label={`${t.contact.callAria} ${PHONE_DISPLAY}`}
                onClick={() => setOpen(false)}
                className="chalet-navigation__menu-secondary"
              >
                <Phone size={15} strokeWidth={1.6} aria-hidden="true" />
                {PHONE_DISPLAY}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="chalet-navigation__menu-secondary"
                aria-label={t.contact.whatsappAria}
              >
                {t.contact.whatsapp}
              </a>
            </div>
            <a
              href={`mailto:${EMAIL}`}
              aria-label={t.contact.emailAria}
              onClick={() => setOpen(false)}
              className="chalet-navigation__menu-secondary"
            >
              <Mail size={15} strokeWidth={1.6} aria-hidden="true" />
              {EMAIL}
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}

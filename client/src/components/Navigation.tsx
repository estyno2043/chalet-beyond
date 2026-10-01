/**
 * Navigation — Chalet Beyond
 * Design: Nordic Brutalism / Dark Timber
 * - Transparent over the hero → solid dark once the page scrolls
 * - Shares the hero's responsive gutters
 * - The reserve action is pale over the hero (it sits on footage next to the
 *   hero's pale CTA) and turns brand amber once the hero is behind the guest
 * - Below xl: reserve, language and a menu; the links live in the menu
 */
import React from "react";
import { usePastHero } from "@/hooks/usePastHero";
import { Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScrollThreshold } from "@/components/ui/use-scroll";
import { useT } from "@/i18n/LanguageProvider";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { RollLink } from "@/components/RollButton";
import { EMAIL, PHONE, PHONE_DISPLAY } from "@shared/contact";
import "./navigation.css";

const HREFS = [
  "#chalet",
  "#priestory",
  "#okolie",
  "#cennik",
  "#rezervacia",
] as const;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const pastHero = usePastHero();

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const scrollToHref = (href: string) => {
    setOpen(false);
    document
      .querySelector(href)
      ?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
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
      {t.nav.book}
    </RollLink>
  );

  return (
    <header
      className="chalet-navigation"
      data-scrolled={scrolled && !open}
      data-open={open}
      data-past-hero={pastHero}
    >
      {/* Contact strip — phone + email, visible on load and through scroll. */}
      <div className="chalet-navigation__contact mx-auto hidden items-center justify-end md:flex">
        {[
          {
            href: `tel:${PHONE}`,
            label: PHONE_DISPLAY,
            Icon: Phone,
            aria: `${t.contact.callAria} ${PHONE_DISPLAY}`,
          },
          {
            href: `mailto:${EMAIL}`,
            label: EMAIL,
            Icon: Mail,
            aria: t.contact.emailAria,
          },
        ].map(({ href, label, Icon, aria }) => (
          <a key={href} href={href} aria-label={aria}>
            <Icon size={12} strokeWidth={1.6} aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>

      <div className="chalet-navigation__inner mx-auto flex items-center justify-between">
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: prefersReducedMotion() ? "auto" : "smooth",
            });
            setOpen(false);
          }}
          className="chalet-navigation__logo"
          aria-label={t.nav.home}
        >
          {/* The house and wordmark from the brand logo, recoloured for a dark
              ground; the tagline is dropped at this size, it would not read. */}
          <img
            src="/logo-light-v1.png"
            alt="Chalet Beyond"
            width={195}
            height={144}
          />
        </a>

        {/* Full navigation — only where it fits (xl). */}
        <nav className="hidden items-center xl:flex">
          <div className="chalet-navigation__links">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => {
                  e.preventDefault();
                  scrollToHref(link.href);
                }}
                className="chalet-navigation__link"
              >
                {link.label}
              </a>
            ))}
          </div>
          <span className="chalet-navigation__divider" aria-hidden="true" />
          <LanguageDropdown />
          {bookButton("ml-3")}
        </nav>

        {/* Compact cluster — everything below xl. */}
        <div className="flex items-center gap-2 xl:hidden">
          {bookButton("chalet-navigation__book--compact")}
          <LanguageDropdown />
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

      {/* Menu overlay — links, then the ways to reach the owners. */}
      <div
        inert={!open}
        aria-hidden={!open}
        className="chalet-navigation__menu xl:hidden"
        data-open={open}
      >
        <div className="flex h-full w-full flex-col justify-between gap-y-2 p-6">
          <div className="grid pt-4">
            {links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => {
                  e.preventDefault();
                  scrollToHref(link.href);
                }}
                className="chalet-navigation__menu-link"
                style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="chalet-navigation__menu-actions">
            <a
              href="#rezervacia"
              onClick={e => {
                e.preventDefault();
                scrollToHref("#rezervacia");
              }}
              className="chalet-navigation__menu-primary"
            >
              {t.nav.bookStay}
            </a>
            <a
              href={`tel:${PHONE}`}
              aria-label={`${t.contact.callAria} ${PHONE_DISPLAY}`}
              onClick={() => setOpen(false)}
              className="chalet-navigation__menu-secondary"
            >
              <Phone size={16} strokeWidth={1.6} aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              aria-label={t.contact.emailAria}
              onClick={() => setOpen(false)}
              className="chalet-navigation__menu-secondary"
            >
              {t.nav.writeUs}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

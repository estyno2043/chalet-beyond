/**
 * Navigation — Chalet Beyond
 * Based on header-2 pattern (sshahaider/header-2)
 * Design: Nordic Brutalism / Dark Timber
 * - Sticky top, transparent → frosted dark glass on scroll
 * - Shrinks from max-w-5xl → max-w-4xl with shadow on scroll
 * - Amber accent on active/hover links with underline reveal
 * - Animated hamburger icon (MenuToggleIcon) for mobile
 * - Mobile menu: full-screen overlay with zoom-in/out animation
 */
import React from 'react';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScrollThreshold } from '@/components/ui/use-scroll';

const links = [
  { label: 'Chalet', href: '#chalet' },
  { label: 'Priestory', href: '#priestory' },
  { label: 'Okolie', href: '#okolie' },
  { label: 'Rezervácia', href: '#rezervacia' },
];

export function Navigation() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScrollThreshold(10);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleLinkClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] mx-auto w-full transition-all duration-300 ease-out',
        {
          // Scrolled: frosted dark glass, shrinks, shadow, rounded pill
          'bg-[oklch(0.08_0.010_55/0.88)] supports-[backdrop-filter]:bg-[oklch(0.08_0.010_55/0.70)] border-b border-[rgba(180,120,40,0.15)] backdrop-blur-xl':
            scrolled && !open,
          // Mobile menu open: solid dark
          'bg-[oklch(0.06_0.008_55/0.98)]': open,
          // Default: fully transparent
          'bg-transparent border-b border-transparent': !scrolled && !open,
        },
      )}
      style={{ willChange: 'transform' }}
    >
      <div
        className={cn(
          'mx-auto flex items-center justify-between px-5 transition-all duration-300 ease-out',
          scrolled ? 'max-w-4xl h-12' : 'max-w-5xl h-14',
        )}
      >
        {/* Logo / Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setOpen(false);
          }}
          className="flex flex-col leading-none select-none group"
          aria-label="Chalet Beyond — domov"
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.1rem',
              letterSpacing: '0.12em',
              color: 'oklch(0.92 0.008 75)',
              lineHeight: 1,
              transition: 'color 0.3s ease',
            }}
          >
            CHALET
          </span>
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.1rem',
              letterSpacing: '0.12em',
              color: 'oklch(0.72 0.12 65)',
              lineHeight: 1,
            }}
          >
            BEYOND
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className={cn(
                'relative px-3 py-1.5 text-xs font-medium tracking-widest uppercase',
                'text-[oklch(0.58_0.020_65)] hover:text-[oklch(0.92_0.008_75)]',
                'transition-colors duration-200',
                'after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px',
                'after:bg-[oklch(0.72_0.12_65)] after:scale-x-0 after:origin-left',
                'after:transition-transform after:duration-300 after:ease-out',
                'hover:after:scale-x-100',
              )}
              style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' }}
            >
              {link.label}
            </a>
          ))}

          {/* CTA button */}
          <a
            href="#rezervacia"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#rezervacia');
            }}
            className={cn(
              'ml-3 px-5 py-2 text-sm font-bold tracking-widest uppercase',
              'rounded-sm transition-all duration-300 ease-out active:scale-[0.97]',
            )}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.12em',
              fontSize: '0.85rem',
              background: 'linear-gradient(180deg, oklch(0.72 0.12 65) 0%, oklch(0.60 0.10 60) 100%)',
              color: 'oklch(0.10 0.010 55)',
              boxShadow: '0 0 0 1px rgba(180,120,40,0.3), 0 2px 8px rgba(180,120,40,0.25)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 0 0 1px rgba(180,120,40,0.5), 0 6px 20px rgba(180,120,40,0.35)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = '';
              el.style.boxShadow = '0 0 0 1px rgba(180,120,40,0.3), 0 2px 8px rgba(180,120,40,0.25)';
            }}
          >
            Rezervovať
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? 'Zavrieť menu' : 'Otvoriť menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={cn(
            'md:hidden flex items-center justify-center w-10 h-10 rounded-sm',
            'border border-[rgba(180,120,40,0.25)] bg-transparent',
            'text-[oklch(0.72_0.12_65)]',
            'transition-all duration-200',
            'hover:border-[rgba(180,120,40,0.5)] hover:bg-[rgba(180,120,40,0.08)]',
            'active:scale-95',
          )}
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </button>
      </div>

      {/* Mobile full-screen menu overlay */}
      <div
        className={cn(
          'fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden md:hidden',
          'border-t border-[rgba(180,120,40,0.15)]',
          'bg-[oklch(0.06_0.008_55/0.98)] backdrop-blur-xl',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        style={{
          opacity: open ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      >
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
            'flex h-full w-full flex-col justify-between gap-y-2 p-6',
          )}
        >
          <div className="grid gap-y-1 pt-4">
            {links.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={cn(
                  'flex items-center px-4 py-4 text-left',
                  'border-b border-[rgba(180,120,40,0.08)]',
                  'text-[oklch(0.75_0.015_65)] hover:text-[oklch(0.92_0.008_75)]',
                  'transition-colors duration-200',
                )}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '2rem',
                  letterSpacing: '0.1em',
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    color: 'oklch(0.62 0.10 65)',
                    letterSpacing: '0.2em',
                    marginRight: '1rem',
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
            <a
              href="#rezervacia"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#rezervacia');
              }}
              className="w-full flex items-center justify-center py-4 rounded-sm text-center"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '0.12em',
                background: 'linear-gradient(180deg, oklch(0.72 0.12 65) 0%, oklch(0.60 0.10 60) 100%)',
                color: 'oklch(0.10 0.010 55)',
                boxShadow: '0 0 0 1px rgba(180,120,40,0.3), 0 4px 16px rgba(180,120,40,0.3)',
              }}
            >
              Rezervovať pobyt
            </a>
            <a
              href="https://www.booking.com/hotel/sk/chalet-beyond.html"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-4 rounded-sm text-center"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '0.12em',
                color: 'oklch(0.72 0.12 65)',
                border: '1px solid rgba(180,120,40,0.3)',
              }}
            >
              Booking.com
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

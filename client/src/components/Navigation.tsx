/*
 * CHALET BEYOND — Navigation
 * Sticky nav, transparent → dark on scroll
 * Amber accent on hover, Bebas Neue font
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Chalet", href: "#chalet" },
  { label: "Priestory", href: "#priestory" },
  { label: "Okolie", href: "#okolie" },
  { label: "Rezervácia", href: "#rezervacia" },
];

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 80));
    return unsub;
  }, [scrollY]);

  const bgOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ willChange: "background" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundColor: "oklch(0.10 0.012 55)",
            opacity: bgOpacity,
            borderBottom: "1px solid oklch(0.72 0.12 65 / 0.12)",
          }}
        />
        <div className="container relative flex items-center justify-between py-5">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex flex-col gap-0 leading-none"
          >
            <span
              className="font-display text-2xl tracking-widest"
              style={{ color: "oklch(0.92 0.008 75)", fontFamily: "'Bebas Neue', sans-serif" }}
            >
              CHALET
            </span>
            <span
              className="font-display text-2xl tracking-widest"
              style={{ color: "oklch(0.72 0.12 65)", fontFamily: "'Bebas Neue', sans-serif" }}
            >
              BEYOND
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="relative group font-mono-data text-xs tracking-widest uppercase transition-colors duration-200"
                style={{ color: "oklch(0.58 0.020 65)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                <span className="group-hover:text-amber transition-colors duration-200"
                  style={{ color: "inherit" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.72 0.12 65)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                >
                  {link.label}
                </span>
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: "oklch(0.72 0.12 65)" }}
                />
              </button>
            ))}
            <button
              onClick={() => handleNav("#rezervacia")}
              className="btn-amber text-sm px-5 py-2.5"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Rezervovať
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "oklch(0.92 0.008 75)" }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        className="fixed inset-0 z-40 md:hidden flex flex-col pt-20 px-6 pb-8"
        style={{ background: "oklch(0.10 0.012 55)" }}
        initial={{ opacity: 0, x: "100%" }}
        animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: "100%" }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="amber-rule mb-8" />
        {navLinks.map((link, i) => (
          <motion.button
            key={link.href}
            onClick={() => handleNav(link.href)}
            className="text-left py-4 border-b"
            style={{
              borderColor: "oklch(0.72 0.12 65 / 0.15)",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "2rem",
              letterSpacing: "0.05em",
              color: "oklch(0.92 0.008 75)",
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {link.label}
          </motion.button>
        ))}
        <motion.button
          onClick={() => handleNav("#rezervacia")}
          className="btn-amber mt-8 justify-center"
          initial={{ opacity: 0 }}
          animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          Rezervovať
        </motion.button>
      </motion.div>
    </>
  );
}

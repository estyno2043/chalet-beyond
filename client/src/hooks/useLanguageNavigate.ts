import { useLocation } from "wouter";
import { pathForLang, type Lang } from "@shared/i18n";

export function useLanguageNavigate() {
  const [, navigate] = useLocation();

  return (lang: Lang) => {
    // Read at click time, not render time: React does not re-render when only
    // the hash changes, so a captured value would be stale. And navigate()
    // rewrites the URL, so it has to be read before the call, not after.
    const hash = window.location.hash;
    navigate(pathForLang(window.location.pathname, lang) + hash);
    if (hash) {
      requestAnimationFrame(() =>
        document.querySelector(hash)?.scrollIntoView({ behavior: "auto" })
      );
    }
  };
}

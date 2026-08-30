/*
 * CHALET BEYOND — language context.
 *
 * The language comes from the URL, never from Accept-Language: redirecting on
 * the browser's locale hurts indexing (crawler and visitor get different pages)
 * and takes the choice away from the guest.
 */
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { dictionaries, langFromPath, type Dict, type Lang } from "@shared/i18n";

const LanguageContext = createContext<{ lang: Lang; t: Dict }>({
  lang: "sk",
  t: dictionaries.sk,
});

export function LanguageProvider({
  lang,
  children,
}: {
  lang?: Lang;
  children: ReactNode;
}) {
  const resolved = lang ?? langFromPath(window.location.pathname);

  // Screen readers announce in the wrong language, and search engines index the
  // wrong one, unless the document says which it is.
  useEffect(() => {
    document.documentElement.lang = resolved;
  }, [resolved]);

  return (
    <LanguageContext.Provider
      value={{ lang: resolved, t: dictionaries[resolved] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/** The active dictionary. */
export function useT(): Dict {
  return useContext(LanguageContext).t;
}

/** The active language code. */
export function useLang(): Lang {
  return useContext(LanguageContext).lang;
}

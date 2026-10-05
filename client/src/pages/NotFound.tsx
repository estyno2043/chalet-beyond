import { RollLink } from "@/components/RollButton";
import { premiumCopy } from "@/components/premium/copy";
import { langFromPath, pathForLang } from "@shared/i18n";
export default function NotFound() {
  const lang = langFromPath(window.location.pathname);
  const c = premiumCopy[lang];
  return (
    <main className="not-found container">
      <h1>404</h1>
      <p>{c.notFound}</p>
      <RollLink href={pathForLang("/", lang)} tone="solid">
        {c.home}
      </RollLink>
    </main>
  );
}

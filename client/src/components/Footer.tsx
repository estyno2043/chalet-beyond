import { useRef } from "react";
import { useT } from "@/i18n/LanguageProvider";
import { COMPANY, EMAIL, PHONE, PHONE_DISPLAY } from "@shared/contact";
import { SectionBackdrop } from "./premium/SectionBackdrop";
import { FooterMark } from "./premium/FooterMark";
// Slovak registry identifiers keep their official abbreviations in every language.
const company = [
  COMPANY.name,
  COMPANY.address,
  COMPANY.ico && `IČO ${COMPANY.ico}`,
  COMPANY.dic && `DIČ ${COMPANY.dic}`,
  COMPANY.icDph && `IČ DPH ${COMPANY.icDph}`,
].filter(Boolean);
export function Footer() {
  const t = useT();
  const footer = useRef<HTMLElement>(null);
  return (
    <footer ref={footer} className="premium-footer">
      <SectionBackdrop photoId={41} className="footer-backdrop" />
      <div className="container">
        <div className="footer-main">
          <a href="#" className="footer-brand">
            <span className="sr-only">Chalet Beyond</span>
            <FooterMark footer={footer} />
          </a>
          <div className="footer-contact">
            <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
        </div>
        <div className="footer-details">
          <address>
            {t.footer.addressStreet}
            <br />
            {t.footer.addressCity}
            <br />
            {t.footer.addressCountry}
          </address>
          <nav aria-label={t.footer.bookingLabel}>
            {[
              [t.nav.chalet, "#chalet"],
              [t.nav.priestory, "#priestory"],
              [t.nav.okolie, "#okolie"],
              [t.nav.cennik, "#cennik"],
              [t.nav.rezervacia, "#rezervacia"],
            ].map(([label, href]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
        </div>
        {company.length > 0 && (
          <p className="footer-company">{company.join(" · ")}</p>
        )}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Chalet Beyond</span>
          <a href={`mailto:${EMAIL}`}>{t.footer.bookingLabel}</a>
        </div>
      </div>
    </footer>
  );
}

import { useT } from "@/i18n/LanguageProvider";
import { EMAIL, PHONE, PHONE_DISPLAY } from "@shared/contact";
export function Footer() {
  const t = useT();
  return (
    <footer className="premium-footer">
      <div className="container">
        <div className="footer-main">
          <a href="#" aria-label="Chalet Beyond">
            <img
              src="/logo-light-v1.png"
              width="240"
              height="100"
              alt="Chalet Beyond"
              className="footer-logo"
            />
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
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Chalet Beyond</span>
          <a href={`mailto:${EMAIL}`}>{t.footer.bookingLabel}</a>
        </div>
      </div>
    </footer>
  );
}

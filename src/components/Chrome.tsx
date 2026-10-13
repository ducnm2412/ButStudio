/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONTACT, TICKER } from "@/lib/site";
import { useLang } from "./LangProvider";

export function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {items.map((x, i) => (
          <span key={i}><i />{x}</span>
        ))}
      </div>
    </div>
  );
}

export function Nav({ overlay = false }: { overlay?: boolean }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [onHero, setOnHero] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const update = () => setOnHero(hero.getBoundingClientRect().bottom > 90);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const links = [
    ["/bo-suu-tap", t("nav.collection")],
    ["/#concepts-world", t("nav.halloween")],
    ["/#services", t("nav.services")],
    ["/#contact", t("nav.contact")],
  ];
  return (
    <header className={`nav${overlay ? " overlay" : ""}${overlay && onHero ? " on-hero" : ""}`}>
      <div className="wrap">
        <div className="nav-pill">
          <Link className="brand" href="/" aria-label="Bụt Studio"><img className="brand-word" src="/logo.png" width={807} height={187} alt="bụt studio" /></Link>
          <nav className={`nav-links${open ? " open" : ""}`} aria-label="Main">
            {links.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
            ))}
          </nav>
          <div className="nav-right">
            <div className="lang" role="group" aria-label="Language">
              {(["vi", "en"] as const).map((l) => (
                <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <a className="btn btn-solid" href="/#book">{t("nav.book")}</a>
            <button className="menu-btn" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer>
      <div className="wrap">
        <Link className="brand" href="/" aria-label="Bụt Studio"><img className="brand-word" src="/logo.png" width={807} height={187} alt="bụt studio" /></Link>
        <nav aria-label="Footer">
          <a href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener">Instagram</a>
          <a href={CONTACT.zalo} target="_blank" rel="noopener">Zalo</a>
          <a href={CONTACT.maps} target="_blank" rel="noopener">Google Maps</a>
        </nav>
        <span>{t("ft.tag")}</span>
      </div>
    </footer>
  );
}

export function StickyBar() {
  const { t } = useLang();
  return (
    <div className="sticky-bar">
      <a className="btn" href={CONTACT.tel}>{t("sb.call")}</a>
      <a className="btn" href={CONTACT.messenger} target="_blank" rel="noopener">Messenger</a>
      <a className="btn btn-solid" href="/#book">{t("nav.book")}</a>
    </div>
  );
}

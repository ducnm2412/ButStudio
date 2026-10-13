/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { CONTACT, IMG, ITEMS } from "@/lib/site";
import { Footer, Nav, StickyBar, Ticker } from "./Chrome";
import { useLang } from "./LangProvider";
import ScrollFx from "./ScrollFx";
import SmoothScroll from "./SmoothScroll";

export default function LookDetail({ k }: { k: string }) {
  const { lang, t } = useLang();
  const i = ITEMS.findIndex((x) => x.k === k);
  const it = ITEMS[i];
  const [src, w, h] = IMG[it.k];
  const [title, cat] = it[lang];
  const prev = ITEMS[(i - 1 + ITEMS.length) % ITEMS.length];
  const next = ITEMS[(i + 1) % ITEMS.length];
  const related = ITEMS.filter((x) => x.k !== it.k && x.t[0] === it.t[0]).slice(0, 4);

  return (
    <>
      <Ticker />
      <Nav />
      <main className="section detail">
        <div className="wrap">
          <Link className="detail-back" href="/#collection">{t("dt.back")}</Link>
          <div className="detail-grid">
            <div className="detail-img"><img src={src} width={w} height={h} alt={title} /></div>
            <div className="detail-side">
              <span className="season-tag">{cat}</span>
              <h1>{title}</h1>
              <p>{t("lb.desc")}</p>
              <p className="meta">{t("lb.price")}</p>
              <div className="hero-cta">
                <Link className="btn btn-lime" href={`/?set=${it.k}#book`}>{t("lb.book")}</Link>
                <a className="btn btn-ghost" href={CONTACT.messenger} target="_blank" rel="noopener">{t("lb.ask")}</a>
              </div>
              <nav className="detail-pager" aria-label="Sets">
                <Link className="btn btn-ghost" href={`/bo-suu-tap/${prev.k}`} aria-label={prev[lang][0]}>←</Link>
                <Link className="btn btn-ghost" href={`/bo-suu-tap/${next.k}`} aria-label={next[lang][0]}>→</Link>
              </nav>
            </div>
          </div>

          {related.length > 0 && (
            <div className="detail-related">
              <h2>{t("dt.related")}</h2>
              <div className="gallery">
                {related.map((r) => (
                  <Link key={r.k} href={`/bo-suu-tap/${r.k}`} className="item">
                    <img src={IMG[r.k][0]} width={IMG[r.k][1]} height={IMG[r.k][2]} alt={r[lang][0]} loading="lazy" />
                    <span className="item-cap"><b>{r[lang][0]}</b><span>{r[lang][1]}</span></span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <StickyBar />
      <ScrollFx />
      <SmoothScroll />
    </>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CONTACT, HOURS, IMG, ITEMS, PHOTOS, type Key, type Tag } from "@/lib/site";
import { Footer, Nav, StickyBar, Ticker } from "./Chrome";
import { useLang } from "./LangProvider";
import ScrollFx from "./ScrollFx";
import SmoothScroll from "./SmoothScroll";

export type Filter = "all" | Tag;
type Booking = { name: string; phone: string; date: string; time: string; cat: string; people: string; note: string };

const COUNTRY_CHIPS: Filter[] = ["all", "vn", "jp", "kr", "cn"];
const STYLE_CHIPS: Filter[] = ["halloween", "cosplay", "wedding", "kids", "couple"];
const CATS: Tag[] = ["vn", "jp", "kr", "cn", "halloween", "cosplay", "wedding", "kids"];

export default function Home() {
  const [filter, setFilter] = useState<Filter>("all");
  const [lbIdx, setLbIdx] = useState(-1);
  const [booking, setBooking] = useState<Booking>({ name: "", phone: "", date: "", time: "", cat: "vn", people: "1", note: "" });

  // Mở thẳng một set khi đến từ trang chi tiết: /?set=hw1#book
  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get("set");
    const it = ITEMS.find((x) => x.k === k);
    if (it) {
      setBooking((b) => ({ ...b, note: it.vi[0], cat: it.t.find((x) => CATS.includes(x)) ?? b.cat }));
    }
  }, []);

  const jumpChip = (f: Filter) => setFilter(f);
  const openFromKey = (k: string) => {
    const i = ITEMS.findIndex((x) => x.k === k);
    if (i >= 0) { setFilter("all"); setLbIdx(i); }
  };

  return (
    <>
      <Ticker />
      <Nav overlay />
      <main id="top">
        <Hero onOpen={openFromKey} />
        <Rail onJump={jumpChip} />
        <Nations onPick={jumpChip} />
        <Collection preview filter={filter} setFilter={setFilter} onOpen={setLbIdx} />
        <Steps />
        <Services />
        <Story />
        <Wall />
        <Book booking={booking} setBooking={setBooking} />
        <Faq />
        <Contact />
      </main>
      <CtaBand />
      <Footer />
      <StickyBar />
      <ScrollFx />
      <SmoothScroll />
      <PromoPopup onBook={() => setBooking((b) => ({ ...b, cat: "halloween" }))} onSee={() => setFilter("halloween")} />
      {lbIdx >= 0 && (
        <Lightbox
          idx={lbIdx}
          filter={filter}
          onChange={setLbIdx}
          onClose={() => setLbIdx(-1)}
          onBook={(i) => {
            const it = ITEMS[i];
            setBooking((b) => ({ ...b, note: it.vi[0], cat: it.t.find((x) => CATS.includes(x)) ?? b.cat }));
          }}
        />
      )}
    </>
  );
}

function Hero({ onOpen }: { onOpen: (k: string) => void }) {
  const { t } = useLang();
  return (
    <section className="hero">
      <div className="hero-bg">
        <img className="d" src={PHOTOS.heroDesktop} alt="" fetchPriority="high" />
        <img className="m" src={PHOTOS.heroMobile} alt="" />
      </div>
      <HeroCards onOpen={onOpen} />
      <div className="wrap">
        <h1><span>{t("hero.l1")}</span><span className="l2">{t("hero.l2")}</span></h1>
        <p className="hero-sub">Kimono · Hanbok · Hanfu · <span>{t("hero.sub")}</span></p>
        <div className="hero-cta">
          <a className="btn btn-lime" href="#book">{t("hero.cta1")}</a>
          <Link className="btn btn-ghost" href="/bo-suu-tap">{t("hero.cta2")}</Link>
        </div>
      </div>
    </section>
  );
}

const HERO_CARDS = ["cn2", "hw1", "vn5", "wed3"];

/** Chồng thẻ bài bên phải hero: tự lật chậm, nút ← → để lật, bấm thẻ để xem chi tiết. */
function HeroCards({ onOpen }: { onOpen: (k: string) => void }) {
  const { lang } = useLang();
  const [top, setTop] = useState(0);
  const n = HERO_CARDS.length;
  const next = () => setTop((x) => (x + 1) % n);
  const prev = () => setTop((x) => (x - 1 + n) % n);
  const [paused, setPaused] = useState(false);

  // Tự lật chậm; dừng khi rê chuột (desktop), tôn trọng reduced-motion
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setTop((x) => (x + 1) % n), 4500);
    return () => window.clearInterval(id);
  }, [paused, n, top]);

  return (
    <div className="hero-cards" aria-roledescription="carousel" onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="hc-stack">
        {HERO_CARDS.map((k, i) => {
          const d = (i - top + n) % n;
          const it = ITEMS.find((x) => x.k === k)!;
          const [title, cat] = it[lang];
          return (
            <button
              key={k}
              type="button"
              className="hc-card"
              data-d={d}
              aria-hidden={d !== 0}
              tabIndex={d === 0 ? 0 : -1}
              aria-label={`${title} — ${lang === "vi" ? "xem chi tiết" : "view details"}`}
              onClick={() => (d === 0 ? onOpen(k) : setTop(i))}
            >
              <img src={IMG[k][0]} alt="" />
              <span className="hc-cap">
                <small>{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} · {cat}</small>
                <b>{title}</b>
              </span>
            </button>
          );
        })}
      </div>
      <div className="hc-nav">
        <button type="button" aria-label="Previous" onClick={prev}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <Link href={`/bo-suu-tap/${HERO_CARDS[top]}`}>{lang === "vi" ? "Xem set này" : "View this set"}</Link>
        <button type="button" aria-label="Next" onClick={next}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}

function Rail({ onJump }: { onJump: (f: Filter) => void }) {
  const { t } = useLang();
  const cards: { jump?: Filter; href: string }[] = [
    { jump: "vn", href: "" }, { jump: "cn", href: "" }, { jump: "cn", href: "" },
    { jump: "couple", href: "" }, { jump: "kids", href: "" }, { jump: "wedding", href: "" },
    { jump: "halloween", href: "" },
  ];
  return (
    <section className="rail-sec" id="concepts">
      <div className="wrap">
        <div className="rail-head"><h2>{t("rl.title")}</h2><span className="rail-hint">{t("rl.hint")}</span></div>
        <div className="rail">
          {cards.map((c, i) => (
            <Link key={i} href={c.jump ? `/bo-suu-tap?f=${c.jump}` : "/bo-suu-tap"}>
              <img src={PHOTOS.rail[i]} alt="" loading="lazy" />
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <span className="cap">
                <b>{t(`rl.${i + 1}` as Key)}</b>
                <span>{t(`rl.${i + 1}s` as Key)}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const NATIONS: { f: Tag; k: string }[] = [
  { f: "vn", k: "vn5" }, { f: "jp", k: "jp3" }, { f: "kr", k: "kr3" }, { f: "cn", k: "cn2" },
];

/** Bốn nền văn hoá — bấm một ô để lọc bộ sưu tập theo nước đó. */
function Nations({ onPick }: { onPick: (f: Filter) => void }) {
  const { t } = useLang();
  return (
    <section className="season nations" id="concepts-world">
      <div className="season-big" aria-hidden="true">4+</div>
      <div className="wrap">
        <div>
          <span className="season-tag">{t("na.tag")}</span>
          <h2>{t("na.t1")}<br /><em>{t("na.t2")}</em></h2>
          <p>{t("na.lead")}</p>
          <Link className="btn" href="/bo-suu-tap">{t("na.cta")}</Link>
        </div>
        <div className="nations-grid">
          {NATIONS.map(({ f, k }) => (
            <Link key={f} href={`/bo-suu-tap?f=${f}`} className="nation">
              <img src={IMG[k][0]} alt="" loading="lazy" />
              <span className="nation-cap">
                <b>{t(`f.${f}` as Key)}</b>
                <span>{t("col.count").replace("{n}", String(ITEMS.filter((it) => it.t.includes(f)).length))}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Popup quảng cáo Halloween: hiện mỗi lần tải / reload trang. */
function PromoPopup({ onBook, onSee }: { onBook: () => void; onSee: () => void }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  const close = () => setOpen(false);
  return (
    <div className="promo" role="dialog" aria-modal="true" aria-labelledby="promo-title" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="promo-card">
        <button ref={closeRef} className="promo-close" type="button" aria-label="Close" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div className="promo-imgs" aria-hidden="true">
          {["hw1", "hw2", "hw8"].map((k) => <img key={k} src={IMG[k][0]} alt="" />)}
        </div>
        <div className="promo-body">
          <span className="season-tag">{t("hw.tag")}</span>
          <h2 id="promo-title">{t("hw.t1")}<br /><em>{t("hw.t2")}</em> {t("hw.t3")}</h2>
          <p>{t("hw.lead")}</p>
          <div className="promo-actions">
            <a className="btn promo-main" href="#book" onClick={() => { onBook(); close(); }}>{t("hw.cta")}</a>
            <Link className="btn promo-ghost" href="/bo-suu-tap?f=halloween" onClick={close}>{t("hw.see")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Collection({ filter, setFilter, onOpen, preview = false }: { filter: Filter; setFilter: (f: Filter) => void; onOpen: (i: number) => void; preview?: boolean }) {
  const { lang, t } = useLang();
  const visible = ITEMS.map((it, i) => ({ it, i })).filter(({ it }) => filter === "all" || it.t.includes(filter));
  const chip = (f: Filter) => (
    <button key={f} className="chip" type="button" data-f={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
      {t(`f.${f}` as Key)}
    </button>
  );
  return (
    <section className="section" id="collection">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>{t("col.title")}</h2>
            <p>{t("col.lead")}</p>
          </div>
          <p style={{ fontSize: 14, fontWeight: 700 }}>{t("col.count").replace("{n}", String(visible.length))}</p>
        </div>

        <div className="filters">
          <div className="filter-group" role="group" aria-label={t("f.country")}>
            <span className="filter-label">{t("f.country")}</span>
            {COUNTRY_CHIPS.map(chip)}
          </div>
          <div className="filter-group" role="group" aria-label={t("f.style")}>
            <span className="filter-label">{t("f.style")}</span>
            {STYLE_CHIPS.map(chip)}
          </div>
        </div>

        <div className={`gallery${preview ? " gallery-preview" : ""}`}>
          {(preview ? visible.slice(0, 12) : visible).map(({ it, i }) => {
            const [src, w, h] = IMG[it.k];
            const [title, cat] = it[lang];
            return (
              <figure key={it.k} className="item" tabIndex={0} onClick={() => onOpen(i)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(i); } }}>
                <img src={src} width={w} height={h} alt={title} loading="lazy" />
                <figcaption><b>{title}</b><span>{cat}</span></figcaption>
              </figure>
            );
          })}
        </div>
        {visible.length === 0 && <p className="gallery-empty">{t("col.empty")}</p>}
        {preview && visible.length > 12 && (
          <div className="gallery-more">
            <Link className="btn btn-solid" href={filter === "all" ? "/bo-suu-tap" : `/bo-suu-tap?f=${filter}`}>{t("col.all").replace("{n}", String(visible.length))}</Link>
          </div>
        )}
        <div className="gallery-foot">
          <span>{t("col.foot")}</span>
          <a className="btn btn-solid" href={CONTACT.messenger} target="_blank" rel="noopener">{t("col.ask")}</a>
        </div>
      </div>
    </section>
  );
}

function Steps() {
  const { t } = useLang();
  return (
    <section className="section" id="experience" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head"><div><h2>{t("st.title")}</h2><p>{t("st.lead")}</p></div></div>
        <div className="steps">
          {[1, 2, 3, 4].map((n) => (
            <article className="step" key={n}>
              <figure><img src={PHOTOS.steps[n - 1]} alt="" loading="lazy" /><i>{n}</i></figure>
              <div><h3>{t(`st.${n}t` as Key)}</h3><p>{t(`st.${n}d` as Key)}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICE_ICONS = [
  <path key="a" d="M10 4l6 3 6-3 5 6-4 3v15H9V13L5 10z" />,
  <g key="b"><circle cx="16" cy="12" r="6" /><path d="M6 28c2-6 6-8 10-8s8 2 10 8" /><path d="M10 7c2-3 10-3 12 0" /></g>,
  <g key="c"><rect x="4" y="9" width="24" height="17" rx="2" /><circle cx="16" cy="17.5" r="5" /><path d="M11 9l2-4h6l2 4" /></g>,
  <g key="d"><circle cx="11" cy="16" r="6" /><circle cx="21" cy="16" r="6" /><path d="M16 11v10" /></g>,
];

const SERVICE_PHOTOS = ["cn2", "hw5", "wed2", "vn6"];

/** Dịch vụ: 4 tấm ảnh dọc; tấm đang chọn giãn rộng và hiện mô tả (hover / bấm). */
function Services() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  // Trễ nhẹ khi rê chuột để lướt ngang qua không làm các tấm giật liên tục
  const hoverTimer = useRef<number | undefined>(undefined);
  const hoverTo = (i: number) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActive(i), 70);
  };
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);
  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="section-head"><div><h2>{t("sv.title")}</h2><p>{t("sv.lead")}</p></div></div>
        <div className="services sv-panels">
          {SERVICE_ICONS.map((icon, i) => (
            <button
              type="button"
              className="service sv-panel"
              key={i}
              data-i={i}
              aria-expanded={active === i}
              onMouseEnter={() => hoverTo(i)}
              onMouseLeave={() => window.clearTimeout(hoverTimer.current)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <img src={IMG[SERVICE_PHOTOS[i]][0]} alt="" loading="lazy" />
              <span className="sv-badge"><svg viewBox="0 0 32 32" aria-hidden="true">{icon}</svg></span>
              <span className="sv-vlabel" aria-hidden="true">{t(`sv.${i + 1}t` as Key)}</span>
              <span className="sv-body">
                <h3>{t(`sv.${i + 1}t` as Key)}</h3>
                <p>{t(`sv.${i + 1}d` as Key)}</p>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  const { t } = useLang();
  const facts: [string, Key][] = [["4+", "wy.f1"], ["7/7", "wy.f2"], ["21:00", "wy.f3"], ["3-in-1", "wy.f4"]];
  return (
    <section className="story" id="why" style={{ backgroundImage: `url(${PHOTOS.story})` }}>
      <div className="wrap">
        <h2>{t("wy.title")}</h2>
        <p>{t("wy.lead")}</p>
        <div className="story-facts">
          {facts.map(([b, k]) => <div key={k}><b>{b}</b><span>{t(k)}</span></div>)}
        </div>
      </div>
    </section>
  );
}

function Wall() {
  const { t } = useLang();
  const rots = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"];
  const row = (srcs: string[], rev = false) => (
    <div className={`wall-row${rev ? " rev" : ""}`}>
      {[...srcs, ...srcs].map((s, i) => (
        <figure key={i} style={{ "--rot": rots[i % 6] } as React.CSSProperties}>
          <img src={s} alt="" loading="lazy" />
        </figure>
      ))}
    </div>
  );
  return (
    <section className="wall" id="moments">
      <h2>{t("wl.title")}</h2>
      {row(PHOTOS.wall1)}
      {row(PHOTOS.wall2, true)}
    </section>
  );
}

function Book({ booking, setBooking }: { booking: Booking; setBooking: React.Dispatch<React.SetStateAction<Booking>> }) {
  const { t } = useLang();
  const [note, setNote] = useState("");
  const [minDate, setMinDate] = useState<string>();
  const channel = useRef<"messenger" | "zalo">("messenger");
  useEffect(() => setMinDate(new Date().toISOString().slice(0, 10)), []);

  const set = (k: keyof Booking) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setBooking((b) => ({ ...b, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const b = Object.fromEntries(Object.entries(booking).map(([k, v]) => [k, v.trim()])) as Booking;
    if (!b.name || !b.phone || !b.date) { setNote(t("bk.missing")); return; }
    const msg = t("bk.msg")
      .replace("{name}", b.name).replace("{phone}", b.phone).replace("{date}", b.date).replace("{time}", b.time)
      .replace("{cat}", t(`f.${b.cat}` as Key)).replace("{people}", b.people || "1").replace("{note}", b.note || "—");
    let copied = false;
    try { await navigator.clipboard.writeText(msg); copied = true; } catch {}
    setNote(copied ? t("bk.copied") : t("bk.nocopy"));
    window.open(channel.current === "zalo" ? CONTACT.zalo : CONTACT.messenger, "_blank", "noopener");
  };

  return (
    <section className="section book" id="book" style={{ backgroundImage: `url(${PHOTOS.book})` }}>
      <div className="wrap">
        <div className="book-copy">
          <h2>{t("bk.t1")}<br /><em>{t("bk.t2")}</em></h2>
          <p>{t("bk.lead")}</p>
          <ol className="book-steps">
            {(["bk.s1", "bk.s2", "bk.s3"] as Key[]).map((k, i) => <li key={k}><i>{i + 1}</i><span>{t(k)}</span></li>)}
          </ol>
        </div>
        <form className="form" noValidate onSubmit={submit}>
          <div className="row2">
            <div className="field"><label htmlFor="fName">{t("bk.name")}</label><input id="fName" type="text" autoComplete="name" required value={booking.name} onChange={set("name")} /></div>
            <div className="field"><label htmlFor="fPhone">{t("bk.phone")}</label><input id="fPhone" type="tel" autoComplete="tel" required value={booking.phone} onChange={set("phone")} /></div>
          </div>
          <div className="row2">
            <div className="field"><label htmlFor="fDate">{t("bk.date")}</label><input id="fDate" type="date" required min={minDate} value={booking.date} onChange={set("date")} /></div>
            <div className="field"><label htmlFor="fTime">{t("bk.time")}</label><input id="fTime" type="time" value={booking.time} onChange={set("time")} /></div>
          </div>
          <div className="row2">
            <div className="field">
              <label htmlFor="fCat">{t("bk.cat")}</label>
              <select id="fCat" value={booking.cat} onChange={set("cat")}>
                {CATS.map((c) => <option key={c} value={c}>{t(`f.${c}` as Key)}</option>)}
              </select>
            </div>
            <div className="field"><label htmlFor="fPeople">{t("bk.people")}</label><input id="fPeople" type="number" min={1} value={booking.people} onChange={set("people")} /></div>
          </div>
          <div className="field"><label htmlFor="fNote">{t("bk.note")}</label><textarea id="fNote" value={booking.note} onChange={set("note")} /></div>
          <div className="form-actions">
            <button className="btn btn-lime" type="submit" onClick={() => (channel.current = "messenger")}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.5 2 2 6.1 2 11.3c0 2.9 1.4 5.5 3.6 7.2V22l3.4-1.9c.9.3 1.9.4 3 .4 5.5 0 10-4.1 10-9.2S17.5 2 12 2zm1 12.4l-2.6-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7-5.4 5.8z" /></svg>
              <span>{t("bk.send1")}</span>
            </button>
            <button className="btn btn-ghost" type="submit" onClick={() => (channel.current = "zalo")}><span>{t("bk.send2")}</span></button>
          </div>
          <p className="form-note" role="status">{note}</p>
        </form>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useLang();
  return (
    <section className="section faq" id="faq">
      <div className="wrap">
        <div className="faq-img"><img src={PHOTOS.faq} alt="" loading="lazy" /></div>
        <div>
          <h2 style={{ marginBottom: 20 }}>{t("fq.title")}</h2>
          {[1, 2, 3, 4, 5].map((n) => (
            <details key={n} open={n === 1}>
              <summary>{t(`fq.${n}q` as Key)}</summary>
              <p>{t(`fq.${n}a` as Key)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useLang();
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(new Date().getDay()), []);
  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <div>
          <h2>{t("ct.title")}</h2>
          <ul className="hours">
            {HOURS.map((h) => (
              <li key={h.day} className={h.day === today ? "today" : undefined}>
                <span>{t(`d.${h.day}` as Key)}</span><span>{h.time}</span>
              </li>
            ))}
          </ul>
          <div className="addr">
            <strong>33 Phan Châu Trinh</strong>
            <span>{t("ct.addr")}</span>
          </div>
          <div className="contact-actions">
            <a className="btn btn-lime" href={CONTACT.tel}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
              {CONTACT.phoneLabel}
            </a>
            <a className="btn btn-ghost" href={CONTACT.messenger} target="_blank" rel="noopener">Messenger</a>
            <a className="btn btn-ghost" href={CONTACT.zalo} target="_blank" rel="noopener">Zalo</a>
            <a className="btn btn-ghost" href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a>
            <a className="btn btn-ghost" href={CONTACT.instagram} target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
        <div className="map" aria-label="Map">
          <svg viewBox="0 0 400 400" aria-hidden="true">
            <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0v40" fill="none" stroke="#2a2a28" strokeWidth="1" /></pattern></defs>
            <rect width="400" height="400" fill="url(#g)" />
            <path d="M-10 290 C 80 260, 140 300, 230 250 S 380 230, 420 200" fill="none" stroke="#9ED8FF" strokeWidth="22" opacity=".35" />
            <path d="M60 -10 L150 410" stroke="#444" strokeWidth="8" />
            <path d="M-10 150 L410 110" stroke="#444" strokeWidth="8" />
            <path d="M250 -10 L330 410" stroke="#444" strokeWidth="5" />
            <text x="236" y="233" fontFamily="var(--font-archivo), sans-serif" fontWeight="700" fontSize="12" fill="#9ED8FF">Sông Hàn</text>
            <text x="112" y="104" fontFamily="var(--font-archivo), sans-serif" fontWeight="700" fontSize="11" fill="#8C8C87" transform="rotate(-5 112 104)">Hùng Vương</text>
            <text x="70" y="300" fontFamily="var(--font-archivo), sans-serif" fontWeight="700" fontSize="11" fill="#8C8C87" transform="rotate(77 70 300)">Phan Châu Trinh</text>
            <g transform="translate(118 182)"><circle r="30" fill="#D8FF4A" opacity=".2" /><path d="M0 -26c-9 0-16 7-16 16 0 12 16 28 16 28s16-16 16-28c0-9-7-16-16-16z" fill="#D8FF4A" /><circle cy="-10" r="5" fill="#0F0F0F" /></g>
          </svg>
          <div className="map-card">
            <div><b>Bụt Studio</b><span>33 Phan Châu Trinh, Hải Châu</span></div>
            <a className="btn btn-solid map-dir" href={CONTACT.maps} target="_blank" rel="noopener">{t("ct.dir")}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  const { t } = useLang();
  return (
    <section className="cta-band" style={{ backgroundImage: `url(${PHOTOS.ctaBand})` }}>
      <div className="wrap">
        <h2>{t("cb.t1")}<br />{t("cb.t2")}</h2>
        <p>{t("cb.lead")}</p>
        <div className="btns">
          <a className="btn btn-lime" href="#book">{t("nav.book")}</a>
          <a className="btn btn-ghost" href={CONTACT.messenger} target="_blank" rel="noopener">Messenger</a>
        </div>
      </div>
    </section>
  );
}

export function Lightbox({ idx, filter, onChange, onClose, onBook, bookHref }: {
  bookHref?: string;
  idx: number; filter: Filter; onChange: (i: number) => void; onClose: () => void; onBook: (i: number) => void;
}) {
  const { lang, t } = useLang();
  const closeRef = useRef<HTMLButtonElement>(null);
  const it = ITEMS[idx];
  const [title, cat] = it[lang];

  const visible = ITEMS.map((x, i) => (filter === "all" || x.t.includes(filter) ? i : -1)).filter((i) => i >= 0);
  const pos = Math.max(0, visible.indexOf(idx));
  const [dir, setDir] = useState(0); // hướng trượt ảnh: 1 = sang set sau, -1 = set trước

  const step = useCallback((d: number) => {
    const v = ITEMS.map((x, i) => (filter === "all" || x.t.includes(filter) ? i : -1)).filter((i) => i >= 0);
    if (!v.length) return;
    let p = v.indexOf(idx); if (p < 0) p = 0;
    setDir(d);
    onChange(v[(p + d + v.length) % v.length]);
  }, [filter, idx, onChange]);

  // Vuốt ngang trên ảnh để chuyển set; ảnh đi theo ngón tay trong lúc kéo
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [drag, setDrag] = useState(0);
  const dragRef = useRef(0); // giá trị mới nhất, không phụ thuộc lần render
  const onTouchStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.touches[0].clientX - touch.current.x;
    const dy = e.touches[0].clientY - touch.current.y;
    if (Math.abs(dx) > Math.abs(dy)) { dragRef.current = dx; setDrag(dx); }
  };
  const onTouchEnd = () => {
    const dx = dragRef.current;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    dragRef.current = 0;
    setDrag(0);
    touch.current = null;
  };

  useEffect(() => {
    const last = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.body.style.overflow = ""; last?.focus(); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button ref={closeRef} className="lb-close" type="button" aria-label="Close" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <button className="lb-nav lb-prev" type="button" aria-label="Previous" onClick={() => step(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button className="lb-nav lb-next" type="button" aria-label="Next" onClick={() => step(1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
      </button>
      <div className="lb-inner">
        <div className="lb-img" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <img
            key={it.k}
            src={IMG[it.k][0]}
            alt={title}
            className={dir > 0 ? "from-right" : dir < 0 ? "from-left" : undefined}
            style={drag ? { transform: `translateX(${drag}px) rotate(${drag / 40}deg)`, transition: "none", opacity: 1 - Math.min(Math.abs(drag) / 600, 0.4) } : undefined}
            draggable={false}
          />
          <span className="lb-count">{pos + 1} / {visible.length}</span>
          <span className="lb-hint" aria-hidden="true">{lang === "vi" ? "← Vuốt để xem set khác →" : "← Swipe for more →"}</span>
        </div>
        <div className="lb-side" key={it.k}>
          <h3>{title}</h3>
          <p className="meta">{cat}</p>
          <p>{t("lb.desc")}</p>
          <p className="meta">{t("lb.price")}</p>
          <a className="btn btn-solid" href={bookHref ?? "#book"} onClick={() => { onBook(idx); onClose(); }}>{t("lb.book")}</a>
          <a className="btn" href={CONTACT.messenger} target="_blank" rel="noopener">{t("lb.ask")}</a>
          <Link className="lb-page" href={`/bo-suu-tap/${it.k}`}>{t("lb.page")}</Link>
        </div>
      </div>
    </div>
  );
}

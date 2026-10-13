"use client";

import { useEffect } from "react";

// Những khối sẽ trượt/hiện lên khi cuộn tới. Con của nhóm (gallery, steps…) hiện so le.
const SINGLE = [
  ".section-head", ".rail-head", ".season .wrap > div:first-child", ".story h2", ".story p",
  ".book-copy", ".form", ".faq-img", ".faq h2", ".contact h2", ".addr", ".map",
  ".cta-band h2", ".cta-band p", ".cta-band .btns", ".wall h2", ".gallery-foot", ".gallery-more",
  ".detail-img", ".detail-side", ".detail-related h2",
];
const GROUPS = [
  ".gallery", ".steps", ".services", ".nations-grid", ".story-facts", ".rail",
  ".book-steps", ".hours", ".contact-actions", ".faq .wrap > div:last-child",
];

/** Hiệu ứng khi cuộn: reveal so le, thanh tiến độ, parallax ảnh hero. */
export default function ScrollFx() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    root.classList.add("fx");
    if (reduce) root.classList.add("fx-reduce");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("in");
          // Reveal xong thì bỏ delay so le để hover phản hồi ngay
          const delay = parseFloat(el.style.getPropertyValue("--rv-delay")) || 0;
          window.setTimeout(() => el.classList.add("done"), delay + 900);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const seen = new WeakSet<Element>();
    const mo = new MutationObserver(() => scan());
    const scan = () => {
      document.querySelectorAll(SINGLE.join(",")).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        el.classList.add("rv");
        io.observe(el);
      });
      document.querySelectorAll(GROUPS.join(",")).forEach((g) => {
        Array.from(g.children).forEach((el, i) => {
          if (seen.has(el)) return;
          seen.add(el);
          el.classList.add("rv");
          (el as HTMLElement).style.setProperty("--rv-delay", `${Math.min(i % 8, 7) * 70}ms`);
          io.observe(el);
        });
      });
    };
    // Đợi 2 frame để React hydrate xong rồi mới đụng vào DOM
    let started = false;
    const start = requestAnimationFrame(() => requestAnimationFrame(() => { started = true; scan(); mo.observe(document.body, { childList: true, subtree: true }); }));
    // Gallery thay đổi khi lọc / xem thêm — quét lại phần tử mới

    // Thanh tiến độ cuộn + parallax hero
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    const heroBg = document.querySelector<HTMLElement>(".hero-bg");
    const heroWrap = document.querySelector<HTMLElement>(".hero .wrap");
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = root.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        if (!reduce && heroBg && y < window.innerHeight * 1.2) {
          heroBg.style.transform = `translate3d(0, ${y * 0.3}px, 0) scale(${1 + y * 0.0002})`;
          if (heroWrap) {
            heroWrap.style.transform = `translate3d(0, ${y * 0.15}px, 0)`;
            heroWrap.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.75)));
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(start);
      void started;
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      bar.remove();
      root.classList.remove("fx", "fx-reduce");
    };
  }, []);

  return null;
}

"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/** Cuộn mượt, chậm rãi bằng Lenis (cả bánh xe chuột lẫn link neo #...). */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6, // càng lớn càng chậm, trôi lâu hơn
      easing: (t) => 1 - Math.pow(1 - t, 4), // ease-out quart: dừng êm
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      autoRaf: true,
      // Không làm mượt bên trong popup/lightbox/dải ngang có thanh cuộn riêng
      prevent: (node) => !!node.closest?.(".lb, .promo, .rail, .filter-group, .nav-links"),
    });

    // Link neo (#book, /#services…) trên cùng trang: trượt chậm tới section, (Lenis tự tính scroll-padding-top của html để chừa chỗ navbar)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;
      e.preventDefault();
      history.replaceState(null, "", url.hash);
      lenis.scrollTo(target, { duration: 1.8, lock: false });
      // Ảnh lazy tải xong trong lúc trượt có thể đẩy vị trí → chỉnh lại nhẹ ở cuối
      window.setTimeout(() => lenis.scrollTo(target, { duration: 0.6 }), 1850);
    };
    document.addEventListener("click", onClick);

    // Popup / lightbox mở thì khoá cuộn trang nền
    const sync = () => (document.querySelector(".lb, .promo") ? lenis.stop() : lenis.start());
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ITEMS } from "@/lib/site";
import { Footer, Nav, StickyBar, Ticker } from "./Chrome";
import { Collection, Lightbox, type Filter } from "./Home";
import { useLang } from "./LangProvider";
import ScrollFx from "./ScrollFx";
import SmoothScroll from "./SmoothScroll";

const FILTERS: Filter[] = ["all", "vn", "jp", "kr", "cn", "halloween", "cosplay", "wedding", "kids", "couple"];

export default function AllCollection() {
  const { t } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const [lbIdx, setLbIdx] = useState(-1);

  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("f") as Filter | null;
    if (f && FILTERS.includes(f)) setFilter(f);
  }, []);

  const changeFilter = (f: Filter) => {
    setFilter(f);
    window.history.replaceState(null, "", f === "all" ? "/bo-suu-tap" : `/bo-suu-tap?f=${f}`);
  };

  return (
    <>
      <Ticker />
      <Nav />
      <main className="all-page">
        <div className="wrap">
          <Link className="detail-back" href="/#collection">{t("all.back")}</Link>
        </div>
        <Collection filter={filter} setFilter={changeFilter} onOpen={setLbIdx} />
      </main>
      <Footer />
      <StickyBar />
      <ScrollFx />
      <SmoothScroll />
      {lbIdx >= 0 && (
        <Lightbox
          idx={lbIdx}
          filter={filter}
          onChange={setLbIdx}
          onClose={() => setLbIdx(-1)}
          onBook={() => {}}
          bookHref={`/?set=${ITEMS[lbIdx].k}#book`}
        />
      )}
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import LookDetail from "@/components/LookDetail";
import { ITEMS } from "@/lib/site";

export function generateStaticParams() {
  return ITEMS.map((it) => ({ id: it.k }));
}

export async function generateMetadata(props: PageProps<"/bo-suu-tap/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const it = ITEMS.find((x) => x.k === id);
  if (!it) return {};
  return { title: `${it.vi[0]} — Bụt Studio`, description: `${it.vi[0]} · ${it.vi[1]} · Bụt Studio Đà Nẵng` };
}

// Đọc params bên trong <Suspense> để shell trang hiện ngay khi điều hướng (Cache Components)
async function Look({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ITEMS.some((x) => x.k === id)) notFound();
  return <LookDetail k={id} />;
}

export default function Page(props: PageProps<"/bo-suu-tap/[id]">) {
  return (
    <Suspense fallback={null}>
      <Look params={props.params} />
    </Suspense>
  );
}

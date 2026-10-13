import type { Metadata } from "next";
import AllCollection from "@/components/AllCollection";

export const metadata: Metadata = {
  title: "Bộ sưu tập trang phục — Bụt Studio Đà Nẵng",
  description: "Toàn bộ Kimono, Hanbok, Hanfu, cổ phục Việt, cosplay, đồ cưới và concept Halloween cho thuê tại Bụt Studio, 33 Phan Châu Trinh, Đà Nẵng.",
};

export default function Page() {
  return <AllCollection />;
}

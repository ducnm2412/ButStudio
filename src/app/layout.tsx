import type { Metadata } from "next";
import { Archivo, Playfair_Display } from "next/font/google";
import { LangProvider } from "@/components/LangProvider";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "vietnamese"],
  axes: ["wdth"],
  style: ["normal", "italic"],
});

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Bụt Studio — Thuê trang phục truyền thống, cosplay, concept · Đà Nẵng",
  description:
    "Bụt Studio Đà Nẵng: thuê Hanbok, Kimono, Hanfu, cổ phục Việt, cosplay, trang phục cưới & concept. Makeup, làm tóc, chụp ảnh tại 33 Phan Châu Trinh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${archivo.variable} ${display.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TractorCompare - 拖拉机规格对比工具",
  description:
    "免费在线对比 John Deere、Kubota、Massey Ferguson、Case IH、New Holland 等主流品牌拖拉机规格参数。并排对比马力、PTO、重量、液压流量等关键指标。",
  keywords: "拖拉机,规格对比,农机,John Deere,Kubota,农机参数,拖拉机选购",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="py-6 text-center text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
          TractorCompare — 农业机械参数对比平台 | 数据仅供参考
        </footer>
      </body>
    </html>
  );
}

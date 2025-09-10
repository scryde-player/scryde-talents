import type { Metadata } from "next";
import "./globals.css";
import FrameChecker from "@/components/ui/FrameChecker/FrameChecker";
import Script from "next/script";
import YMHit from "@/components/ui/YMHit/YMHit";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Scryde Talents",
  description: "by fans",
  icons: {
    icon: "/assets/images/fav.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`antialiased`}>
        <FrameChecker>
          <Script
            id="ym-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],
              k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              // Для SPA: отключаем авто-отправку инициализационного hit (defer:true)
              ym(104101060, "init", {
                defer: true,
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true
              });
            `,
            }}
          />

          <noscript>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/104101060`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
          <main className="flex flex-col justify-center items-center min-h-screen">
            {children}
          </main>
          <Suspense>
            <YMHit />
          </Suspense>
        </FrameChecker>
        <div className="fixed bottom-2 right-2 text-xs text-gray-400 opacity-50">
          created by angry & nomad
        </div>
      </body>
    </html>
  );
}

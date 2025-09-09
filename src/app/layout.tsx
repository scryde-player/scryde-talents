import type { Metadata } from "next";
import "./globals.css";
import FrameChecker from "@/components/ui/FrameChecker/FrameChecker";

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
        {/* Проверка условий для показа заглушки */}
        <FrameChecker>
          <main className="flex flex-col justify-center items-center min-h-screen">
            {children}
          </main>
        </FrameChecker>
        <div className="fixed bottom-2 right-2 text-xs text-gray-400 opacity-50">
          created by angry & nomad
        </div>
      </body>
    </html>
  );
}
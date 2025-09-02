import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scryde Talents",
  description: "by fans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`antialiased`}>
        <main className="flex flex-col justify-center items-center min-h-screen">
          {children}
        </main>
        <div className="fixed bottom-2 right-2 text-xs text-gray-400 opacity-50">
          created by angry & nomad
        </div>
      </body>
    </html>
  );
}

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
      </body>
    </html>
  );
}

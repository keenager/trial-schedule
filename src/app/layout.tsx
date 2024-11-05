import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="h-dvh bg-white dark:bg-gray-900">
        {/* <header className="fixed left-0 right-0 top-0 z-10 dark:bg-gray-900">
          
        </header> */}
        <main className="h-[95%] flex flex-col bg-white px-8 py-8 dark:bg-gray-900">
          {children}
        </main>
        <footer className="h-[5%] text-center bg-white dark:bg-gray-900">
          <span>Developed by RedTraining</span>
        </footer>
      </body>
    </html>
  );
}

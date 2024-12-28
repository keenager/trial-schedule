import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "기일부 앱",
  description:
    "법관통합 일정메뉴에서 내려받은 엑셀파일을 불러와서 보기 좋게 표시하기 위해 만든 앱입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-white dark:bg-gray-900">
        {/* <header className="fixed left-0 right-0 top-0 z-10 dark:bg-gray-900">
          
        </header> */}
        <main className="h-[95%] px-8 py-8 flex flex-col bg-white dark:bg-gray-900">
          {children}
        </main>
        <footer className="h-[5%] px-8 bg-white dark:bg-gray-900 text-right no-print">
          <span className="badge badge-outline">keenager@scourt.go.kr</span>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ECHO - Khám phá mối quan hệ với AI",
  description: "ECHO giúp bạn tự đánh giá mức độ phụ thuộc vào AI và tìm lại giá trị của chính mình. Dự án nghiên cứu khoa học cấp tỉnh năm học 2026-2027.",
  keywords: ["AI", "học tập", "tư duy", "nghiên cứu khoa học", "THPT"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased paper-texture">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "은파미용실 - 상주시 전문 헤어살롱",
  description: "경상북도 상주시 남성동 위치. 커트, 펌, 염색, 헤어 케어 전문. 온라인 예약 가능. 전화: 054-535-6353",
  keywords: "은파미용실, 상주 미용실, 상주 헤어살롱, 남성동 미용실, 상주 커트, 상주 펌, 상주 염색",
  authors: [{ name: "은파미용실" }],
  openGraph: {
    title: "은파미용실 - 상주시 전문 헤어살롱",
    description: "경상북도 상주시 남성동 위치. 온라인 예약 가능. 전화: 054-535-6353",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com",
    siteName: "은파미용실",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "은파미용실 - 상주시 전문 헤어살롱",
    description: "경상북도 상주시 남성동 위치. 온라인 예약 가능.",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 구조화 데이터 (Schema.org) - 로컬 비즈니스
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: '은파미용실',
    '@id': process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com',
    telephone: '054-535-6353',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '경상북도 상주시 남성동 101-29번지',
      addressLocality: '상주시',
      addressRegion: '경상북도',
      addressCountry: 'KR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.4121609,
      longitude: 128.1621865,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

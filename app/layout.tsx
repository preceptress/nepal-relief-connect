import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nepal-relief-connect.sites.openai.com'),
  title: 'Nepal Relief Connect',
  description: 'A real-time platform connecting people in need across Nepal with people who can help.',
  openGraph: {
    title: 'Nepal Relief Connect',
    description: 'Connect. Coordinate. Save Lives.',
    images: [{url: '/og.png', width: 1536, height: 1024, alt: 'Nepal Relief Connect'}],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nepal Relief Connect',
    description: 'Connect. Coordinate. Save Lives.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

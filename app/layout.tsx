import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import FootballChatbot from '@/components/FootballChatbot';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'EDGE Football | البوابة الكروية الذكية وسوق الانتقالات',
  description: 'بوابة إخبارية رياضية متكاملة مدعومة بالذكاء الاصطناعي لتغطية الدوريات والمباريات وسوق الانتقالات',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <FootballChatbot />
      </body>
    </html>
  );
}
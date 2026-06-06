import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Emergent — Crea app dal nulla con AI',
  description: 'Trasforma le tue idee in applicazioni web reali attraverso semplici conversazioni con AI.',
  keywords: ['AI', 'no-code', 'web app', 'generatore', 'Gemini'],
  openGraph: {
    title: 'Emergent — Crea app dal nulla con AI',
    description: 'Trasforma le tue idee in applicazioni web reali.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-neutral-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}

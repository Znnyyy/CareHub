import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareHub — Sistem Manajemen Klinik',
  description: 'Platform digital manajemen klinik CareHub',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
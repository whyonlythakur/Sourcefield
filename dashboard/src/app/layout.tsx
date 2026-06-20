import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'AutoMod Pro — Dashboard',
  description: 'Fully-automatic Discord moderation dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-white font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

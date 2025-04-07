import { Providers } from '@/components/Providers';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

export const metadata = {
  title: 'CryptoWeather Nexus',
  description: 'A dashboard for weather and cryptocurrency updates',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
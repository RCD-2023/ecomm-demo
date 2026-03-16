import type { Metadata } from 'next';
import '@/assets/styles/globals.css';
import { APP_NAME } from '@/lib/constants';
import Header from '@/components/shared/header';
import Footer from '@/components/footer';



export const metadata: Metadata = {
  title: `${APP_NAME}`,
  description: 'Demo of Modern ecommerce platfom',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <div className='flex h-screen flex-col'>
        <Header />
        <main className='flex-1 wrapper'>{children}</main>
        <Footer />
      </div>
    );
}

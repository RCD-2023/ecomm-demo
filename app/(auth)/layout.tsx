import type { Metadata } from 'next';
import '@/assets/styles/globals.css';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${APP_NAME}`,
  description: 'Demo of Modern ecommerce platfom',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex-center min-h-screen w-full'>
     {children}
    </div>
  );
}

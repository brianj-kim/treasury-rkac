import type { Metadata } from "next";
import { manrope } from '@/components/fonts';
import { cn } from '@/lib/utils'

import "./globals.css";
import Providers from "@/contexts/providers";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Church Finance Management",
  description: "Regina Korean Alliance Church Office Department",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-screen flex-col font-sans antialiased',
          manrope.className
        )}
      >        
        <Providers>          
          <Header />
          <main className='grow'>{children}</main>
          <Footer />          
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

export default RootLayout;
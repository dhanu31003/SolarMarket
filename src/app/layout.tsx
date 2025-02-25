'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { CartProvider } from '@/contexts/CartContext'
import Header from '@/components/layout/Header'
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
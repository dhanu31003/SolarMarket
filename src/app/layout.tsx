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
            <title> Affordable Solar Panels with PM Modi Subsidy</title>
            <meta name="description" content="Find the best solar panels at SolarMarket. Get up to ₹80,000 subsidy under PM Modi's solar scheme. Compare prices, check specifications, and order online." />
            <meta name="keywords" content="solar panels, PM Modi solar subsidy, solar energy India, Solar Agency, Best Deals" />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

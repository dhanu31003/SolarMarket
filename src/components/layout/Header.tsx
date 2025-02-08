'use client';

import React from 'react';
import { Sun, ShoppingCart, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const { data: session } = useSession();
  const { state } = useCart();

  // Add a null check for state and state.items
  const cartItemCount = state?.items?.length || 0;
  const isAdmin = session?.user?.role === 'admin';

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center">
            <Sun className="h-8 w-8 text-yellow-500" />
            <span className="ml-2 text-xl font-bold text-gray-900">SolarMarket</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {isAdmin ? (
              // Admin Navigation
              <>
                <Link href="/products" className="text-gray-600 hover:text-gray-900">
                  Products
                </Link>
                <Link href="/companies" className="text-gray-600 hover:text-gray-900">
                  Companies
                </Link>
                <Link href="/admin/orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>
              </>
            ) : (
              // Regular User Navigation
              <>
                <Link href="/products" className="text-gray-600 hover:text-gray-900">
                  Products
                </Link>
                <Link href="/companies" className="text-gray-600 hover:text-gray-900">
                  Companies
                </Link>
                <Link href="/calculator" className="text-gray-600 hover:text-gray-900">
                  Solar Calculator
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Only show cart for non-admin users */}
            {!isAdmin && (
              <Link href="/cart" className="text-gray-600 hover:text-gray-900 relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            {session ? (
              <button 
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <User className="h-6 w-6" />
                {isAdmin && <span className="text-sm font-medium">Admin</span>}
              </button>
            ) : (
              <Link 
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900"
              >
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
'use client';  // Add this at the top

import React from 'react';
import { Sun, ShoppingCart, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session } = useSession();

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
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <ShoppingCart className="h-6 w-6" />
            </button>
            {session ? (
              <button 
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-900"
              >
                <User className="h-6 w-6" />
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
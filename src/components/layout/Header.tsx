'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, ShoppingCart, User, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import styles from './Header.module.css'; // Import the CSS module

const Header = () => {
  const { data: session } = useSession();
  const { state } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const cartItemCount = state?.items?.length || 0;
  const isAdmin = session?.user?.role === 'admin';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" replace className="flex items-center">
            <Sun className="h-8 w-8 text-yellow-500" />
            <span className="ml-2 text-xl font-bold text-gray-900">SolarMarket</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href={isAdmin ? '/admin/products' : '/products'} className={`text-gray-600 hover:text-gray-900 ${styles.animatedLink}`}>
              Products
            </Link>
            {!isAdmin && (
              <>
                <Link href="/calculator" className={`text-gray-600 hover:text-gray-900 ${styles.animatedLink}`}>
                  Solar Calculator
                </Link>
                <Link href="/about" className={`text-gray-600 hover:text-gray-900 ${styles.animatedLink}`}>
                  About
                </Link>
              </>
            )}
            {isAdmin && (
              <Link href="/orders" className={`text-gray-600 hover:text-gray-900 ${styles.animatedLink}`}>
                Orders
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!isAdmin && (
              <Link href="/cart" className={`text-gray-600 hover:text-gray-900 relative ${styles.animatedButton}`}>
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none ${styles.animatedButton}`}
              >
                <User className="h-6 w-6" />
                {isAdmin && <span className="text-sm font-medium">Admin</span>}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                  {session ? (
                    <>
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{session.user?.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{session.user?.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
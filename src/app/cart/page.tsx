'use client';

import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/cart/CartItem';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { state } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-4">Add some products to your cart and they will appear here</p>
        <Link
          href="/products"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {state.items.map((item) => (
                <CartItem key={item._id} {...item} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-black">
                  <span>Subtotal</span>
                  <span className="text-black font-medium">₹{state.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Shipping</span>
                  <span className="text-black">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Tax</span>
                  <span className="text-black">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-lg text-black">
                  <span>Total</span>
                  <span className="text-black">₹{state.total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// src/app/page.tsx
import { Sun, Battery, Award, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find the Perfect Solar Solution
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Compare and buy solar panels from India's top manufacturers
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
              Explore Products
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <Sun className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Top Brands</h3>
              <p className="text-gray-600">
                Choose from India's leading solar panel manufacturers
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Battery className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Comparison</h3>
              <p className="text-gray-600">
                Compare specifications and prices easily
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Award className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Quality</h3>
              <p className="text-gray-600">
                All products meet strict quality standards
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Get help with selection and installation
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
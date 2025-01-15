'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  specifications: {
    wattage: number;
    efficiency: string;
    type: string;
  };
  rating: number;
  company?: {
    _id: string;
    name: string;
    logo: string;
  };
}

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    type: '',
    minWattage: '',
    maxWattage: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...filters
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
      
      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Solar Panels</h1>
          {session?.user?.role === 'admin' && (
            <Link
              href="/admin/products/add"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Monocrystalline">Monocrystalline</option>
              <option value="Polycrystalline">Polycrystalline</option>
              <option value="Thin-Film">Thin-Film</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/products/${product._id}`} key={product._id} className="block h-full">
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
                <div className="relative pt-[75%] bg-gray-100 rounded-t-lg">
                  <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name || 'Product Image'}
                    className="absolute top-0 left-0 w-full h-full object-contain p-4 rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 h-14">
                    {product.name || 'Unnamed Product'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.company?.name || 'Unknown Manufacturer'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{(product.price || 0).toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {product.specifications?.wattage || 0}W
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {product.specifications?.type || 'N/A'}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-xs">
                      {product.specifications?.efficiency || 'N/A'} efficiency
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  page === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
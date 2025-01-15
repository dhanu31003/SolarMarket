'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AddProductPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [productData, setProductData] = useState({
    name: '',
    company: '',
    price: '',
    specifications: {
      wattage: '',
      efficiency: '',
      warranty: '',
      type: 'Monocrystalline',
      dimensions: {
        length: '',
        width: '',
        height: ''
      },
      weight: '0'
    },
    description: '',
    features: [''],
    stock: '',
    images: [] as string[],
    installationAvailable: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Convert string values to numbers
    const formattedData = {
        ...productData,
        price: Number(productData.price),
        specifications: {
          ...productData.specifications,
          wattage: Number(productData.specifications.wattage),
          weight: Number(productData.specifications.weight),
          dimensions: {
            length: Number(productData.specifications.dimensions.length),
            width: Number(productData.specifications.dimensions.width),
            height: Number(productData.specifications.dimensions.height),
          }
        },
        stock: Number(productData.stock),
      };  

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      router.push('/products');
    } catch (error: any) {
      setError(error.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Show not authorized message if not admin
  if (session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Authorized</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Solar Panel</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-sm p-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">Basic Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData({...productData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={productData.company}
                  onChange={(e) => setProductData({...productData, company: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData({...productData, price: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">Specifications</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wattage (W)
                </label>
                <input
                  type="number"
                  value={productData.specifications.wattage}
                  onChange={(e) => setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      wattage: e.target.value
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Efficiency (%)
                </label>
                <input
                  type="text"
                  value={productData.specifications.efficiency}
                  onChange={(e) => setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      efficiency: e.target.value
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={productData.specifications.type}
                  onChange={(e) => setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      type: e.target.value
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Monocrystalline">Monocrystalline</option>
                  <option value="Polycrystalline">Polycrystalline</option>
                  <option value="Thin-Film">Thin-Film</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty (years)
                </label>
                <input
                  type="text"
                  value={productData.specifications.warranty}
                  onChange={(e) => setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      warranty: e.target.value
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length (mm)
                </label>
                <input
                  type="number"
                  value={productData.specifications.dimensions.length}
                  onChange={(e) => setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      dimensions: {
                        ...productData.specifications.dimensions,
                        length: e.target.value
                      }
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width (mm)
                </label>
                <input
                  type="number"
                  value={productData.specifications.dimensions.width}
                  onChange={(e) => setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      dimensions: {
                        ...productData.specifications.dimensions,
                        width: e.target.value
                      }
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (mm)
                </label>
                <input
                  type="number"
                  value={productData.specifications.dimensions.height}
                  onChange={(e) => setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      dimensions: {
                        ...productData.specifications.dimensions,
                        height: e.target.value
                      }
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">Product Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={productData.description}
                onChange={(e) => setProductData({...productData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                value={productData.stock}
                onChange={(e) => setProductData({...productData, stock: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={productData.installationAvailable}
                  onChange={(e) => setProductData({
                    ...productData,
                    installationAvailable: e.target.checked
                  })}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Installation Available
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/products')}
              className="px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
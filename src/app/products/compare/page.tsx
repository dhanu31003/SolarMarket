'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  specifications: {
    wattage: number;
    efficiency: string;
    type: string;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    weight: number;
    warranty: string;
  };
  company: {
    name: string;
    logo: string;
  };
}

export default function CompareProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
        
        if (compareList.length === 0) {
            setLoading(false);
            return;
          }
          
          const productPromises = compareList.map(async (id: string) => {
            try {
              const response = await fetch('/api/products/' + id);
              return await response.json();
            } catch (error) {
              console.error(`Error fetching product ${id}:`, error);
              return null;
            }
          });
          
        const fetchedProducts = (await Promise.all(productPromises)).filter(Boolean);
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const removeFromComparison = (productId: string) => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    const updatedList = compareList.filter((id: string) => id !== productId);
    localStorage.setItem('compareList', JSON.stringify(updatedList));
    setProducts(products.filter(p => p._id !== productId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Products to Compare</h2>
          <p className="text-gray-600 mb-8">Add products to comparison to see them here.</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Compare Products</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left bg-gray-50 w-48">Features</th>
                {products.map((product) => (
                  <th key={product._id} className="p-4 text-left min-w-[300px]">
                    <div className="relative">
                      <button
                        onClick={() => removeFromComparison(product._id)}
                        className="absolute -top-2 -right-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="relative w-full pt-[75%] bg-gray-100 rounded-lg mb-4">
                        <img
                          src={product.images[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="absolute top-0 left-0 w-full h-full object-contain p-4"
                        />
                      </div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-600">{product.company.name}</p>
                      <p className="text-2xl font-bold mt-2">₹{product.price.toLocaleString()}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium bg-gray-50">Power Output</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4">
                    {product.specifications.wattage}W
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium bg-gray-50">Efficiency</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4">
                    {product.specifications.efficiency}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium bg-gray-50">Type</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4">
                    {product.specifications.type}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium bg-gray-50">Dimensions</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4">
                    {product.specifications.dimensions.length} × {product.specifications.dimensions.width} × {product.specifications.dimensions.height} mm
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium bg-gray-50">Weight</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4">
                    {product.specifications.weight} kg
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium bg-gray-50">Warranty</td>
                {products.map((product) => (
                  <td key={product._id} className="p-4">
                    {product.specifications.warranty}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add More Products
          </button>
        </div>
      </div>
    </div>
  );
}
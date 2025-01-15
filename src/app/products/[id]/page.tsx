'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ScaleIcon, Zap, Clock, Shield, ShoppingCart, BarChart2 } from 'lucide-react';

interface Product {
  _id: string;
  name?: string;
  price?: number;
  images?: string[];
  specifications?: {
    wattage?: number;
    efficiency?: string;
    type?: string;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    weight?: number;
    warranty?: string;
  };
  description?: string;
  features?: string[];
  company?: {
    name?: string;
    logo?: string;
  };
  rating?: number;
  stock?: number;
  installationAvailable?: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!params.id) {
          setError('Product ID not found');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError('Error loading product');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Product not found'}</p>
          <button
            onClick={() => router.push('/products')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative pt-[75%] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images?.[selectedImage] || '/placeholder.jpg'}
                  alt={product.name || 'Product Image'}
                  className="absolute top-0 left-0 w-full h-full object-contain p-4"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 
                        ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                    >
                      <img
                        src={image || '/placeholder.jpg'}
                        alt={`${product.name || 'Product'} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name || 'Unnamed Product'}</h1>
                <p className="text-lg text-gray-600">{product.company?.name || 'Unknown Manufacturer'}</p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{(product.price || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                </div>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Zap className="w-5 h-5" />
                    <span>Power Output</span>
                  </div>
                  <p className="text-lg font-semibold">{product.specifications?.wattage || 0}W</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ScaleIcon className="w-5 h-5" />
                    <span>Efficiency</span>
                  </div>
                  <p className="text-lg font-semibold">{product.specifications?.efficiency || 'N/A'}</p>
                </div>
              </div>

              {product.description && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Physical Specifications</h3>
                  <dl className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Dimensions</dt>
                      <dd>
                        {product.specifications?.dimensions?.length || 0} × 
                        {product.specifications?.dimensions?.width || 0} × 
                        {product.specifications?.dimensions?.height || 0} mm
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Type</dt>
                      <dd>{product.specifications?.type || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Features</h3>
                    <ul className="mt-2 space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
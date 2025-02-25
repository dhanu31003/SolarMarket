'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ScaleIcon, Zap, Clock, Shield, ShoppingCart, Trash2, Pencil } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

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
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const id = params?.id;
        if (!id) {
          setError('Product ID not found');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Error loading product');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  const handleAddToCart = () => {
    if (!session) {
      alert('Please log in to add items to the cart.');
      router.push('/auth/signin'); // Ensure this path is correct
      return;
    }

    if (product) {
      addItem({
        _id: product._id,
        name: product.name || 'Unnamed Product',
        price: product.price || 0,
        image: product.images?.[0] || '/placeholder.jpg',
        specifications: {
          wattage: product.specifications?.wattage || 0
        }
      });
      alert('Product added to cart!');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeleteLoading(true);
    setError(null);
    
    try {
      const id = params?.id;
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      router.push('/products');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Failed to delete product');
      console.error('Error deleting product:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

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
        {error && (
          <div className="mb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Admin Actions */}
            {session?.user?.role === 'admin' && (
                <div className="col-span-2 flex justify-end space-x-4">
                    <button
                    onClick={() => router.push(`/admin/products/${params?.id}/edit`)}
                    className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                    <Pencil className="w-5 h-5 mr-2" />
                    Edit Product
                    </button>
                    <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="flex items-center px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    <Trash2 className="w-5 h-5 mr-2" />
                    {deleteLoading ? 'Deleting...' : 'Delete Product'}
                    </button>
                </div>
            )}

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
                  <div className="flex gap-2">
                    {/* Show Add to Cart button only for non-admin users */}
                    {session?.user?.role !== 'admin' && (
                      <button 
                        onClick={handleAddToCart}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Zap className="w-5 h-5" />
                    <span>Power Output</span>
                  </div>
                  <p className="text-lg font-semibold text-black">{product.specifications?.wattage || 0}W</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ScaleIcon className="w-5 h-5" />
                    <span>Efficiency</span>
                  </div>
                  <p className="text-lg font-semibold text-black">{product.specifications?.efficiency || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Shield className="w-5 h-5" />
                    <span>Warranty</span>
                  </div>
                  <p className="text-lg font-semibold text-black">
                    {product.specifications?.warranty ? `${product.specifications.warranty} years` : 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>Installation</span>
                  </div>
                  <p className="text-lg font-semibold text-black">
                    {product.installationAvailable ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Features and Specifications */}
          <div className="border-t border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Specifications</h2>
                <div>
                  <h3 className="font-semibold text-gray-900">Physical Specifications</h3>
                  <dl className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Dimensions</dt>
                      <dd className="text-gray-800">
                        {product.specifications?.dimensions?.length || 0} × 
                        {product.specifications?.dimensions?.width || 0} × 
                        {product.specifications?.dimensions?.height || 0} mm
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Type</dt>
                      <dd className="text-gray-800">{product.specifications?.type || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4 text-blue-600">Features</h2>
                  <ul className="space-y-2 text-gray-800">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
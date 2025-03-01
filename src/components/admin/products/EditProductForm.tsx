'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface EditProductFormProps {
  productId: string;
}

interface ProductFormData {
  name: string;
  company: string;
  price: string;
  specifications: {
    wattage: string;
    efficiency: string;
    warranty: string;
    type: 'Monocrystalline' | 'Polycrystalline' | 'Thin-Film';
    dimensions: {
      length: string;
      width: string;
      height: string;
    };
    weight: string;
  };
  description: string;
  stock: string;
  installationAvailable: boolean;
  features: string[];
  status: 'active' | 'outOfStock' | 'discontinued';
}

export default function EditProductForm({ productId }: EditProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  // Mark imageFiles as unused.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [productData, setProductData] = useState<ProductFormData>({
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
        height: '',
      },
      weight: '0',
    },
    description: '',
    stock: '',
    installationAvailable: true,
    features: [''],
    status: 'active',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch product');

        setProductData({
          ...data,
          company: data.company?.name || '',
          price: data.price?.toString() || '',
          specifications: {
            ...data.specifications,
            wattage: data.specifications?.wattage?.toString() || '',
            dimensions: {
              length: data.specifications?.dimensions?.length?.toString() || '',
              width: data.specifications?.dimensions?.width?.toString() || '',
              height: data.specifications?.dimensions?.height?.toString() || '',
            },
            weight: data.specifications?.weight?.toString() || '0',
          },
          stock: data.stock?.toString() || '',
        });

        setFeatures(data.features || ['']);
        setExistingImages(data.images || []);
      } catch (error: unknown) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product details');
      }
    };

    fetchProduct();
  }, [productId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);

    for (const file of newFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        setImageUrls((prev) => [...prev, data.url]);
      } catch (error: unknown) {
        console.error('Error uploading image:', error);
        setError('Failed to upload one or more images');
      }
    }
  };

  const removeImage = (index: number, type: 'new' | 'existing') => {
    if (type === 'new') {
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    if (index === features.length - 1 && value.trim() !== '') {
      setFeatures([...newFeatures, '']);
    }
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
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
          },
        },
        stock: Number(productData.stock),
        features: features.filter((feature) => feature.trim() !== ''),
        images: [...existingImages, ...imageUrls],
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update product');
      }

      await router.push('/admin/products');
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Error updating product');
      } else {
        setError('Error updating product');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-sm p-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={productData.company}
                onChange={(e) => setProductData({ ...productData, company: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">Product Images</h2>
          {existingImages.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Existing Images</h3>
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative">
                    <div className="relative w-full h-32">
                      <Image
                        src={url}
                        alt={`Product ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index, 'existing')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <div className="relative w-full h-32">
                    <Image
                      src={url}
                      alt={`New ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index, 'new')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">Features</h2>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder="Enter feature"
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {index !== features.length - 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Specifications Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">Specifications</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wattage (W)</label>
              <input
                type="number"
                value={productData.specifications.wattage}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      wattage: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Efficiency (%)</label>
              <input
                type="text"
                value={productData.specifications.efficiency}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      efficiency: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={productData.specifications.type}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      type: e.target.value as 'Monocrystalline' | 'Polycrystalline' | 'Thin-Film',
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Monocrystalline">Monocrystalline</option>
                <option value="Polycrystalline">Polycrystalline</option>
                <option value="Thin-Film">Thin-Film</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warranty</label>
              <input
                type="text"
                value={productData.specifications.warranty}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      warranty: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length (mm)</label>
              <input
                type="number"
                value={productData.specifications.dimensions.length}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      dimensions: {
                        ...productData.specifications.dimensions,
                        length: e.target.value,
                      },
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width (mm)</label>
              <input
                type="number"
                value={productData.specifications.dimensions.width}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      dimensions: {
                        ...productData.specifications.dimensions,
                        width: e.target.value,
                      },
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (mm)</label>
              <input
                type="number"
                value={productData.specifications.dimensions.height}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    specifications: {
                      ...productData.specifications,
                      dimensions: {
                        ...productData.specifications.dimensions,
                        height: e.target.value,
                      },
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              value={productData.specifications.weight}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  specifications: {
                    ...productData.specifications,
                    weight: e.target.value,
                  },
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 pb-2 border-b">Product Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
            <input
              type="number"
              value={productData.stock}
              onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={productData.installationAvailable}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  installationAvailable: e.target.checked,
                })
              }
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">Installation Available</label>
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
            onClick={() => {
              router.push('/admin/products');
              router.refresh();
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

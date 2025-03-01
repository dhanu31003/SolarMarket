'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    // ...other product fields...
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add product');
      }

      router.push('/products');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Error adding product');
      } else {
        setError('Error adding product');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          required
        />
        <textarea
          name="description"
          value={productData.description}
          onChange={handleInputChange}
          placeholder="Product Description"
          required
        />
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleInputChange}
          placeholder="Product Price"
          required
        />
        {/* ...other form fields... */}
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

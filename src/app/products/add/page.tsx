const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      // Add credentials include
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Add this line
        body: JSON.stringify(productData),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add product');
      }
  
      router.push('/products');
    } catch (error: any) {
      setError(error.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };
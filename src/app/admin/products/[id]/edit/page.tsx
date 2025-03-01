'use client';

import { useRouter, useParams } from 'next/navigation';
import EditProductForm from '@/components/admin/products/EditProductForm';
import { useSession } from 'next-auth/react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  // Check loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Check authentication
  if (!session?.user) {
    router.push('/auth/signin');
    return null;
  }

  // Don't check for admin role here, let the API handle that
  return (
    <div className="container mx-auto px-4 py-8">
      <EditProductForm productId={params.id as string} />
    </div>
  );
}

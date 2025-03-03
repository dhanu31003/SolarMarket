'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Only check authorization once the session is loaded
    if (status === 'loading') return;

    // For debugging - log what session we have
    console.log('Admin layout session:', session);
    
    if (!session) {
      // If no session, redirect to login
      router.replace('/auth/signin');
    } else if (session.user?.role !== 'admin') {
      // If session exists but user is not admin, redirect with error message
      console.log('Not an admin user:', session.user);
      router.replace('/auth/signin?error=You must be an admin to access this page');
    } else {
      // User is authenticated and is an admin
      setIsAuthorized(true);
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Only render children if user is authorized
  return isAuthorized ? (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  ) : null;
}
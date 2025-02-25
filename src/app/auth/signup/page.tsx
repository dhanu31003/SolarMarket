'use client';

import SignUpForm from '../../../components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <SignUpForm />
      </div>
    </div>
  );
}
// src/app/admin/products/[id]/edit/layout.tsx
export default function EditProductLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }
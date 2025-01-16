import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongodb';
import { Product } from '@/lib/models/Product';
import { authOptions } from '@/lib/auth/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findById(params.id).populate('company', 'name logo');

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { message: 'Error fetching product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get server session with full configuration
    const session = await getServerSession(authOptions);
    
    console.log('Current session:', session); // Debug log

    if (!session?.user?.role || session.user.role !== 'admin') {
      console.log('Unauthorized - Current session:', session); // Debug log
      return NextResponse.json(
        { message: 'You must be an admin to delete products' },
        { status: 401 }
      );
    }

    await connectDB();

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Product deleted successfully',
      success: true 
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: error.message || 'Error deleting product' },
      { status: 500 }
    );
  }
}
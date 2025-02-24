import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongodb';
import { Product } from '@/lib/models/Product';
import { Company } from '@/lib/models/Company';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow GET requests without authentication
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();

    // Handle company update if needed
    if (data.company) {
      let company = await Company.findOne({ name: data.company });
      if (!company) {
        company = await Company.create({
          name: data.company,
          description: `Manufacturer of ${data.name}`,
          location: 'India',
          contactInfo: {
            email: 'contact@example.com',
            phone: '1234567890',
            address: 'India'
          }
        });
      }
      data.company = company._id;
    }

    // Explicitly strip out any cart-related fields
    const {
      cartId, 
      cartQuantity, 
      inCart,
      ...cleanedData
    } = data;

    const product = await Product.findByIdAndUpdate(
      params.id,
      { $set: cleanedData },
      { 
        new: true,
        runValidators: true
      }
    ).populate('company', 'name logo');

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: error.message || 'Error updating product' },
      { status: 500 }
    );
  }
}
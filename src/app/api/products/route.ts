import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongodb';
import { Product } from '@/lib/models/Product';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '1000000');
    const type = searchParams.get('type') || '';
    const minWattage = parseInt(searchParams.get('minWattage') || '0');
    const maxWattage = parseInt(searchParams.get('maxWattage') || '1000');
    
    await connectDB();

    // Build query
    const query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (type) {
      query['specifications.type'] = type;
    }
    
    if (minPrice || maxPrice) {
      query.price = { 
        ...(minPrice && { $gte: minPrice }),
        ...(maxPrice && { $lte: maxPrice })
      };
    }

    if (minWattage || maxWattage) {
      query['specifications.wattage'] = {
        ...(minWattage && { $gte: minWattage }),
        ...(maxWattage && { $lte: maxWattage })
      };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const products = await Product.find(query)
      .populate('company', 'name logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
    
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { message: 'Error fetching products', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    // Commented out authorization check temporarily
    /*if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }*/

    await connectDB();
    const data = await request.json();

    // Create a temporary company ID
    const tempCompanyId = new mongoose.Types.ObjectId();

    // Prepare product data
    const productData = {
      ...data,
      company: tempCompanyId,
      specifications: {
        ...data.specifications,
        weight: data.specifications.weight || 0,
        dimensions: {
          length: Number(data.specifications.dimensions.length),
          width: Number(data.specifications.dimensions.width),
          height: Number(data.specifications.dimensions.height)
        },
        wattage: Number(data.specifications.wattage)
      },
      price: Number(data.price),
      stock: Number(data.stock)
    };

    // Create new product
    const product = await Product.create(productData);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: error.message || 'Error creating product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    
    // Commented out authorization check temporarily
    /*if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }*/

    await connectDB();
    const data = await request.json();
    const { id, ...updateData } = data;

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate('company', 'name logo');

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    
    // Commented out authorization check temporarily
    /*if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }*/

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
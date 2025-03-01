import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongodb';
import { Company } from '@/lib/models/Company';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || '';
    const category = searchParams.get('category') || '';
    
    await connectDB();

    // Build query
    const query: { [key: string]: unknown } = { status: 'active' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (country) {
      query.location = { $regex: country, $options: 'i' };  // Changed to match the location field
    }

    if (category) {
      query.productCategories = { $regex: category, $options: 'i' };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch companies with pagination
    const companies = await Company.find(query)
      .sort({ rating: -1 })  // Changed to match the rating field
      .skip(skip)
      .limit(limit)
      .lean();  // Added for better performance

    // Get total count for pagination
    const total = await Company.countDocuments(query);

    return NextResponse.json({
      companies,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
    
  } catch (error: unknown) {
    console.error('Companies fetch error:', error);
    let errorMessage = 'Error fetching companies';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: 'Error fetching companies', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const session = await getServerSession();
    
    // Commented out temporarily for testing
    /*if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }*/

    await connectDB();
    const data = await request.json();

    // Create new company
    const company = await Company.create({
      ...data,
      rating: 0,
      reviews: [],
      status: 'active'
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating company:', error);
    let errorMessage = 'Error creating company';
    if (error instanceof Error) {
      errorMessage = error.message || 'Error creating company';
    }
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const session = await getServerSession();
    
    // Commented out temporarily for testing
    /*if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }*/

    await connectDB();
    const data = await request.json();
    const { id, ...updateData } = data;

    const company = await Company.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!company) {
      return NextResponse.json(
        { message: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error: unknown) {
    console.error('Error updating company:', error);
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const session = await getServerSession();
    
    // Commented out temporarily for testing
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
        { message: 'Company ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return NextResponse.json(
        { message: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Company deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting company:', error);
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

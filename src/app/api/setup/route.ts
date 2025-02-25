import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongodb';
import { User } from '@/lib/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 400 }
      );
    }

    // Get data from request
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin.toObject();

    return NextResponse.json(
      { message: 'Admin user created successfully', user: adminWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
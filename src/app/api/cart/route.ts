import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/db/mongodb';
import { Cart } from '@/lib/models/Cart';

// Get cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Find cart by user email
    const cart = await Cart.findOne({ userEmail: session.user.email }).lean();
    
    // If no cart exists yet, return empty cart
    if (!cart) {
      return NextResponse.json({ 
        cart: {
          items: [],
          total: 0
        }
      });
    }

    return NextResponse.json({ cart });

  } catch (error: any) {
    console.error('Error in GET /api/cart:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// Update cart
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const cartData = await request.json();
    
    await connectDB();
    
    // Update or create cart
    const updatedCart = await Cart.findOneAndUpdate(
      { userEmail: session.user.email },
      {
        $set: {
          items: cartData.items,
          total: cartData.total,
          lastUpdated: new Date()
        }
      },
      { 
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true // Run model validations
      }
    ).lean();

    return NextResponse.json({ cart: updatedCart });

  } catch (error: any) {
    console.error('Error in POST /api/cart:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// Clear cart
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    await Cart.findOneAndUpdate(
      { userEmail: session.user.email },
      {
        $set: {
          items: [],
          total: 0,
          lastUpdated: new Date()
        }
      },
      { new: true }
    );

    return NextResponse.json({
      cart: {
        items: [],
        total: 0
      }
    });

  } catch (error: any) {
    console.error('Error in DELETE /api/cart:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
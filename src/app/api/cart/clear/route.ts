import { NextResponse } from 'next/server';
import connectToDB from '@/lib/db/mongodb';
import { Cart } from '@/lib/models/Cart';

export async function POST(req: Request) {
  try {
    const { itemId } = await req.json();
    const userEmail = req.headers.get('x-user-email');

    if (!userEmail || !itemId) {
      return NextResponse.json({ message: 'Missing user email or item ID' }, { status: 400 });
    }

    await connectToDB();

    const cart = await Cart.findOne({ userEmail });
    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    // Convert itemId to a string and remove the item properly
    const updatedItems = cart.items.filter((item: { _id: string }) => item._id.toString() !== itemId);

    const updatedCart = await Cart.findOneAndUpdate(
      { userEmail },
      { $set: { items: updatedItems, total: updatedItems.reduce((total: number, item: { price: number; quantity: number }) => total + item.price * item.quantity, 0) } },
      { new: true }
    );

    if (!updatedCart) {
      return NextResponse.json({ message: 'Failed to update cart' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Item removed successfully', cart: updatedCart }, { status: 200 });
  } catch (error) {
    console.error('Error removing item from cart:', error);
  
    return NextResponse.json(
      { 
        message: 'Server error', 
        error: (error as Error).message // Explicitly cast error as Error
      }, 
      { status: 500 }
    );
  }
}
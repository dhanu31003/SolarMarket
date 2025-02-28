import React from 'react';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartItemProps {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  specifications: {
    wattage: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({
  _id,
  name,
  price,
  quantity,
  image,
  specifications,
}) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(_id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={image || '/placeholder.jpg'}
          alt={name}
          width={96}
          height={96}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{specifications.wattage}W</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-8 text-center text-black">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-black">₹{(price * quantity).toLocaleString()}</span>
            <button
              onClick={() => removeItem(_id)}
              className="p-1 text-red-500 hover:bg-red-50 rounded-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  specifications: {
    wattage: number;
  };
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'SET_CART'; payload: CartState }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const CartContext = createContext<CartContextType | null>(null);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const cartReducer = (state: CartState = initialState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        total: calculateTotal(action.payload.items),
      };

    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item._id === action.payload._id);

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        const newItems = [...state.items, newItem];
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
        };
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item._id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item._id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { data: session, status } = useSession();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const loadCart = async () => {
      if (status === 'loading') return;
  
      if (session?.user) {
        try {
          const response = await fetch('/api/cart?timestamp=' + new Date().getTime()); // Force fresh fetch
          if (response.ok) {
            const data = await response.json();
            if (data?.cart?.items) {
              dispatch({ type: 'SET_CART', payload: data.cart });
            }
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    };
  
    loadCart();
  }, [session, status]);
  

  useEffect(() => {
    const syncCart = async () => {
      if (session?.user) {
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state),
          });
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      }
    };

    if (state.items.length > 0) {
      syncCart();
    }
  }, [state, session]);

  const addItem = async (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item as CartItem });
  };

  const removeItem = async (id: string) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': session?.user?.email || '' // Ensure email is passed
        },
        body: JSON.stringify({ itemId: id }),
      });
  
      const text = await response.text(); // Read response as text
      console.log('API Response:', text); // Log the raw response
  
      const jsonResponse = JSON.parse(text); // Parse as JSON
      if (!response.ok) {
        throw new Error(jsonResponse.message || 'Failed to remove item from database');
      }
  
      dispatch({ type: 'SET_CART', payload: jsonResponse.cart });
    } catch (error) {
      console.error('Remove item error:', error);
    }
  };    
  

  const updateQuantity = async (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });

    if (session?.user) {
      try {
        await fetch('/api/cart/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: id, quantity }),
        });
      } catch (error) {
        console.error('Error updating item quantity:', error);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    if (session?.user) {
      try {
        await fetch('/api/cart/clear', { method: 'DELETE' });
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

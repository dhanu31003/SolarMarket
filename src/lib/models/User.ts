import mongoose from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'company';
  orders?: mongoose.Types.ObjectId[];
  savedProducts?: mongoose.Types.ObjectId[];
  cart: {
    items: Array<{
      productId: mongoose.Types.ObjectId;
      quantity: number;
      name: string;
      price: number;
      image: string;
      specifications: {
        wattage: number;
      };
    }>;
    total: number;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Please provide a name']
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password should be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'company'],
    default: 'user'
  },
  cart: {
    items: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      name: String,
      price: Number,
      image: String,
      specifications: {
        wattage: Number
      }
    }],
    total: {
      type: Number,
      default: 0
    }
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  savedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
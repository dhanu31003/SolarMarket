import mongoose from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'company';
  orders?: mongoose.Types.ObjectId[];
  savedProducts?: mongoose.Types.ObjectId[];
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
    unique: true,  // This will create the index
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password should be at least 6 characters'],
    select: false // This ensures password isn't returned in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'company'],
    default: 'user'
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
  timestamps: true, // Automatically add createdAt and updatedAt fields
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password; // Ensure password is never sent to client
      return ret;
    }
  }
});

// Don't create the model if it already exists
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
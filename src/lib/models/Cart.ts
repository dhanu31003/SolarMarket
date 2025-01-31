import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  _id: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  specifications: {
    wattage: Number
  }
});

const CartSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true
  },
  items: {
    type: [CartItemSchema],
    default: []
  },
  total: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

CartSchema.index({ userEmail: 1 });

export const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
// src/lib/models/Review.ts
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Please provide review title'],
    trim: true
  },
  comment: {
    type: String,
    required: [true, 'Please provide review comment']
  },
  verifiedPurchase: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;
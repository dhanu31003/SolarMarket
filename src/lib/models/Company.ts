// src/lib/models/Company.ts
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide company name'],
    unique: true,
    trim: true
  },
  logo: {
    type: String,
    required: [true, 'Please provide company logo']
  },
  description: {
    type: String,
    required: [true, 'Please provide company description']
  },
  foundedYear: {
    type: Number,
    required: true
  },
  headquarters: {
    country: String,
    city: String
  },
  website: {
    type: String,
    required: true
  },
  certifications: [{
    name: String,
    year: Number,
    issuer: String
  }],
  contact: {
    email: String,
    phone: String,
    address: String
  },
  ratings: {
    average: { 
      type: Number, 
      default: 0 
    },
    count: { 
      type: Number, 
      default: 0 
    }
  },
  productCategories: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add indexes for common queries
companySchema.index({ name: 'text' });
companySchema.index({ status: 1 });

export const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

export default Company;
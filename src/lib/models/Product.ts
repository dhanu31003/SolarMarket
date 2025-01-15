// src/lib/models/Product.ts
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  specifications: {
    wattage: { 
      type: Number, 
      required: true 
    },
    efficiency: { 
      type: String, 
      required: true 
    },
    warranty: { 
      type: String, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['Monocrystalline', 'Polycrystalline', 'Thin-Film'],
      required: true 
    },
    dimensions: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    },
    weight: { type: Number, required: true },
    temperatureCoefficient: { type: Number },
    operatingTemperature: {
      min: { type: Number },
      max: { type: Number }
    }
  },
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review' 
  }],
  images: [{ 
    type: String 
  }],
  description: { 
    type: String, 
    required: true 
  },
  features: [{ 
    type: String 
  }],
  certifications: [{ 
    type: String 
  }],
  stock: { 
    type: Number, 
    required: true,
    min: 0
  },
  installationAvailable: { 
    type: Boolean, 
    default: true 
  },
  status: {
    type: String,
    enum: ['active', 'outOfStock', 'discontinued'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add indexes for common queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ 'specifications.wattage': 1 });
productSchema.index({ price: 1 });
productSchema.index({ company: 1 });
productSchema.index({ status: 1 });

// src/lib/models/Company.ts
const companySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  logo: { 
    type: String 
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  reviews: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review' 
  }],
  location: { 
    type: String, 
    required: true 
  },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  yearEstablished: { 
    type: Number 
  },
  certifications: [{ 
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

// Add company indexes
companySchema.index({ name: 'text' });
companySchema.index({ status: 1 });

// src/lib/models/User.ts
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true,
    select: false // Won't include password in queries by default
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
  timestamps: true
});

// Add user indexes
userSchema.index({ email: 1 });

// src/lib/models/Order.ts
const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  installationRequired: { 
    type: Boolean, 
    default: false 
  },
  installationDate: { 
    type: Date 
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  }
}, {
  timestamps: true
});

// Add order indexes
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Export models
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
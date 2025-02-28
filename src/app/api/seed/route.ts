import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import { Product } from '@/lib/models/Product';
import { Company } from '@/lib/models/Company';

const sampleCompanies = [
  {
    name: "Tata Power Solar",
    description: "Leading solar manufacturer in India",
    logo: "/company-logos/tata.png",
    location: "Mumbai, India",
    rating: 0,
    reviews: [],
    contactInfo: {
      email: "contact@tatapower.com",
      phone: "+91-1234567890",
      address: "Mumbai, Maharashtra"
    },
    certifications: [],
    status: "active"
  },
  {
    name: "Tata Solar",
    description: "Premium solar panel manufacturer",
    logo: "/company-logos/adani.png",
    location: "Ahmedabad, India",
    rating: 0,
    reviews: [],
    contactInfo: {
      email: "contact@adanisolar.com",
      phone: "+91-9876543210",
      address: "Ahmedabad, Gujarat"
    },
    certifications: [],
    status: "active"
  },
  {
    name: "Adani Solar",
    description: "Premier solar panel manufacturer",
    logo: "/company-logos/adani.png",
    location: "Ahmedabad, India",
    rating: 0,
    reviews: [],
    contactInfo: {
      email: "contact@adanisolar.com",
      phone: "+91-9876543210",
      address: "Ahmedabad, Gujarat"
    },
    certifications: [],
    status: "active"
  }
];

const sampleProducts = [
  {
    name: "Tata Power 440W Mono PERC",
    price: 18500,
    specifications: {
      wattage: 440,
      efficiency: "20.2%",
      warranty: "25 years",
      type: "Monocrystalline",
      dimensions: {
        length: 1754,
        width: 1096,
        height: 30
      },
      weight: 21
    },
    description: "High-efficiency monocrystalline solar panel",
    features: ["PERC Technology", "Anti-reflective coating", "High wind resistance"],
    stock: 50,
    images: ["/placeholder.jpg"]
  },
  {
    name: "Tata Power 100W Mono PERC",
    price: 10500,
    specifications: {
      wattage: 220,
      efficiency: "25.2%",
      warranty: "30 years",
      type: "Monocrystalline",
      dimensions: {
        length: 1954,
        width: 896,
        height: 40
      },
      weight: 25
    },
    description: "Very High-efficiency monocrystalline panel",
    features: ["PERC Technology", "Anti-reflective coating", "High wind resistance","High water resistance", "High heat resistanec"],
    stock: 70,
    images: ["/placeholder.jpg"]
  },
  {
    name: "Adani 535W Solar Panel",
    price: 22000,
    specifications: {
      wattage: 535,
      efficiency: "21.3%",
      warranty: "25 years",
      type: "Monocrystalline",
      dimensions: {
        length: 1872,
        width: 1116,
        height: 35
      },
      weight: 23
    },
    description: "Premium high-wattage solar panel",
    features: ["Half-cell technology", "Low light performance", "Salt mist resistant"],
    stock: 35,
    images: ["/placeholder.jpg"]
  }
];

export async function GET() {
  try {
    await connectDB();

    // Clear existing data
    await Company.deleteMany({});
    await Product.deleteMany({});

    // Add companies
    const companies = await Company.insertMany(sampleCompanies);

    // Add products with company references
    const productsWithCompanies = sampleProducts.map((product, index) => ({
      ...product,
      company: companies[index]._id
    }));

    await Product.insertMany(productsWithCompanies);

    return NextResponse.json({ 
      message: 'Sample data added successfully',
      companies: companies.length,
      products: productsWithCompanies.length
    });

  } catch (error: unknown) {
    console.error('Seed error:', error);
    let errorMessage = 'Seed error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

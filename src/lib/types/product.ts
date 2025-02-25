// src/lib/types/product.ts

export interface SolarPanel {
    id: string;
    name: string;
    company: string;
    price: number;
    specifications: {
      wattage: number;
      efficiency: string;
      warranty: string;
      type: string;
      dimensions: {
        length: number;
        width: number;
        height: number;
      };
      weight: number;
    };
    rating: number;
    reviews: number;
    images: string[];
    description: string;
    features: string[];
    certifications: string[];
    stock: number;
    installationAvailable: boolean;
  }
  
  export interface Company {
    id: string;
    name: string;
    description: string;
    logo: string;
    rating: number;
    reviews: number;
    location: string;
    contactInfo: {
      email: string;
      phone: string;
      address: string;
    };
    yearEstablished: number;
    certifications: string[];
  }
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Plus, MapPin, Star, Phone, Mail } from 'lucide-react';

interface Company {
  _id: string;
  name: string;
  logo: string;
  description: string;
  foundedYear: number;
  headquarters: {
    country: string;
    city: string;
  };
  website: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  productCategories: string[];
  status: 'active' | 'inactive';
}

export default function CompaniesPage() {
  const { data: session } = useSession();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    category: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '8',
          ...filters
        });
        const response = await fetch(`/api/companies?${params}`);
        const data = await response.json();
        setCompanies(data.companies);
        setTotalPages(data.pagination.pages);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [page, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Solar Panel Manufacturers</h1>
          {session?.user?.role === 'admin' && (
            <Link
              href="/admin/companies/add"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Company
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by country..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by category..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company) => (
            <Link href={`/companies/${company._id}`} key={company._id} className="block h-full">
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full p-6">
                <div className="relative h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Image
                    src={company.logo || '/placeholder.jpg'}
                    alt={company.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{company.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{company.headquarters.city}, {company.headquarters.country}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    <span>{company.ratings.average.toFixed(1)} ({company.ratings.count} reviews)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{company.contact.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{company.contact.email}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  page === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

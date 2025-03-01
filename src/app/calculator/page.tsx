'use client';

import React, { useState } from 'react';
import {
  Sun,
  DollarSign,
  Zap,
  Calendar,
  BarChart,
  Activity,
  Clock,
  Send,
  HelpCircle,
} from 'lucide-react';

const SolarCalculator = () => {
  // Form state with proper TypeScript types
  const [formData, setFormData] = useState({
    monthlyBill: 3000,
    roofArea: 50,
    location: 'Central',
    roofType: 'Flat',
    name: '',
    email: '',
    phone: '',
  });

  // Results state with proper TypeScript types
  const [results, setResults] = useState({
    recommendedSize: 0,
    estimatedCost: 0,
    annualSavings: 0,
    roiYears: 0,
    co2Reduction: 0,
    lifetimeSavings: 0,
  });

  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sunlight data per region (hours of peak sunlight)
  const regionSunlightData: Record<string, number> = {
    North: 5.5,
    South: 6.2,
    East: 5.7,
    West: 5.9,
    Central: 6.0,
  };

  // Roof efficiency factors
  const roofEfficiencyFactors: Record<string, number> = {
    Flat: 1.0,
    'Sloped (South Facing)': 1.2,
    'Sloped (East/West Facing)': 0.9,
    'Sloped (North Facing)': 0.7,
  };

  // Calculation helpers
  const calculateRecommendedSize = (
    monthlyBill: number,
    location: string,
    roofType: string
  ): number => {
    // Assuming average cost per kWh is ₹8
    const avgCostPerKwh = 8;
    const monthlyUsage = monthlyBill / avgCostPerKwh;
    const dailyUsage = monthlyUsage / 30;

    const sunlightHours = regionSunlightData[location] || 5.5;
    const roofFactor = roofEfficiencyFactors[roofType] || 1.0;

    // Basic formula: Size in kW = (Daily usage in kWh) / (Sunlight hours * Efficiency * Roof factor)
    return Math.round((dailyUsage / (sunlightHours * 0.8 * roofFactor)) * 10) / 10;
  };

  const calculateEstimatedCost = (systemSize: number): number => {
    // Average cost per kW installed (in ₹)
    const costPerKw = 65000;
    return Math.round(systemSize * costPerKw);
  };

  const calculateAnnualSavings = (monthlyBill: number): number => {
    // Simplified calculation: assuming solar covers 80% of electricity needs
    return Math.round(monthlyBill * 12 * 0.8);
  };

  const calculateROI = (cost: number, annualSavings: number): number => {
    return Math.round((cost / annualSavings) * 10) / 10;
  };

  const calculateCO2Reduction = (systemSize: number): number => {
    // Average CO2 emissions per kWh in India is around 0.82 kg
    // Annual generation per kW is roughly 1500 kWh in India
    return Math.round((systemSize * 1500 * 0.82) / 1000); // in tonnes
  };

  const calculateLifetimeSavings = (annualSavings: number): number => {
    // Assuming 25 years panel lifetime
    return annualSavings * 25;
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Slider change handlers
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: parseInt(value),
    }));
  };

  // Calculate results
  const calculateResults = () => {
    setLoading(true);

    setTimeout(() => {
      const recommendedSize = calculateRecommendedSize(
        formData.monthlyBill,
        formData.location,
        formData.roofType
      );

      const estimatedCost = calculateEstimatedCost(recommendedSize);
      const annualSavings = calculateAnnualSavings(formData.monthlyBill);
      const roiYears = calculateROI(estimatedCost, annualSavings);
      const co2Reduction = calculateCO2Reduction(recommendedSize);
      const lifetimeSavings = calculateLifetimeSavings(annualSavings);

      setResults({
        recommendedSize,
        estimatedCost,
        annualSavings,
        roiYears,
        co2Reduction,
        lifetimeSavings,
      });

      setShowResults(true);
      setLoading(false);
    }, 1500); // Simulated calculation delay
  };

  // Send results to WhatsApp
  const sendToWhatsApp = () => {
    // Format the message for WhatsApp
    const message = `*Solar Calculator Results*%0A
Name: ${formData.name}%0A
Email: ${formData.email}%0A
Phone: ${formData.phone}%0A
Monthly Bill: ₹${formData.monthlyBill}%0A
Roof Area: ${formData.roofArea} sq.m%0A
Location: ${formData.location}%0A
Roof Type: ${formData.roofType}%0A
%0A*Calculation Results*%0A
Recommended System Size: ${results.recommendedSize} kW%0A
Estimated Cost: ₹${results.estimatedCost.toLocaleString()}%0A
Annual Savings: ₹${results.annualSavings.toLocaleString()}%0A
ROI: ${results.roiYears} years%0A
CO2 Reduction: ${results.co2Reduction} tonnes/year%0A
25-Year Savings: ₹${results.lifetimeSavings.toLocaleString()}`;

    // Your WhatsApp number (replace with your actual number with country code)
    const phoneNumber = '919030348946'; // Format: countrycode+number

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Solar Savings Calculator
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Estimate your potential savings and return on investment with solar
            energy.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {!showResults ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Enter Your Details
                </h2>

                {/* Monthly Electricity Bill */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Monthly Electricity Bill (₹)
                    </label>
                    <span className="text-blue-600 font-semibold">
                      ₹{formData.monthlyBill.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    name="monthlyBill"
                    min="500"
                    max="20000"
                    step="100"
                    value={formData.monthlyBill}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹500</span>
                    <span>₹20,000</span>
                  </div>
                </div>

                {/* Roof Area */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Available Roof Area (sq. meters)
                    </label>
                    <span className="text-blue-600 font-semibold">
                      {formData.roofArea} sq.m
                    </span>
                  </div>
                  <input
                    type="range"
                    name="roofArea"
                    min="10"
                    max="200"
                    step="5"
                    value={formData.roofArea}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10 sq.m</span>
                    <span>200 sq.m</span>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Location in India
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="North">North India</option>
                    <option value="South">South India</option>
                    <option value="East">East India</option>
                    <option value="West">West India</option>
                    <option value="Central">Central India</option>
                  </select>
                </div>

                {/* Roof Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roof Type
                  </label>
                  <select
                    name="roofType"
                    value={formData.roofType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Flat">Flat Roof</option>
                    <option value="Sloped (South Facing)">
                      Sloped Roof (South Facing)
                    </option>
                    <option value="Sloped (East/West Facing)">
                      Sloped Roof (East/West Facing)
                    </option>
                    <option value="Sloped (North Facing)">
                      Sloped Roof (North Facing)
                    </option>
                  </select>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={calculateResults}
                    disabled={loading || !formData.name || !formData.email || !formData.phone}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Calculating...
                      </>
                    ) : (
                      <>
                        Calculate My Solar Savings
                        <BarChart className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Your Solar Power Estimate
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Sun className="h-8 w-8 text-blue-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">
                        Recommended System
                      </h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">
                      {results.recommendedSize} kW
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      System size based on your requirements
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">
                        Estimated Cost
                      </h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{results.estimatedCost.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Before any applicable subsidies
                    </p>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Zap className="h-8 w-8 text-yellow-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">
                        Annual Savings
                      </h3>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">
                      ₹{results.annualSavings.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Savings on electricity bills
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Clock className="h-8 w-8 text-purple-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">
                        Payback Period
                      </h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">
                      {results.roiYears} years
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Return on investment timeframe
                    </p>
                  </div>

                  <div className="bg-teal-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Activity className="h-8 w-8 text-teal-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">
                        CO₂ Reduction
                      </h3>
                    </div>
                    <p className="text-3xl font-bold text-teal-600">
                      {results.co2Reduction} tonnes/year
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Environmental impact
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-8 w-8 text-red-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">
                        25-Year Savings
                      </h3>
                    </div>
                    <p className="text-3xl font-bold text-red-600">
                      ₹{results.lifetimeSavings.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Lifetime system savings
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mt-6">
                  <div className="flex items-start mb-4">
                    <HelpCircle className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">What&apos;s Next?</h3>
                      <p className="text-gray-600 mt-1">
                        These calculations are estimates based on your inputs and average
                        solar performance in your region. For a precise quote and
                        personalized system design, our experts will need to conduct a detailed
                        site assessment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={() => setShowResults(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Recalculate
                  </button>
                  <button
                    onClick={sendToWhatsApp}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <span>Share Results via WhatsApp</span>
                    <Send className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  How accurate is this calculator?
                </h3>
                <p className="text-gray-600 mt-2">
                  This calculator provides estimates based on average solar
                  conditions in your region and typical installation costs. Actual
                  savings may vary based on specific site conditions, local electricity
                  rates, and the final system configuration.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Are government subsidies included?
                </h3>
                <p className="text-gray-600 mt-2">
                  No, the estimated costs shown are before any applicable government
                  subsidies or incentives. Depending on your location and eligibility,
                  you may qualify for additional savings through various solar subsidy
                  programs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  How much roof space do I need?
                </h3>
                <p className="text-gray-600 mt-2">
                  On average, you need about 10 square meters of roof space for every 1
                  kW of solar capacity. A typical 5 kW residential system would require
                  approximately 50 square meters of unshaded roof area.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  What maintenance is required?
                </h3>
                <p className="text-gray-600 mt-2">
                  Solar panels require minimal maintenance. Occasional cleaning to
                  remove dust and debris, typically 2-4 times per year, is usually
                  sufficient. The inverter may need replacement after 10-15 years, while
                  the panels themselves typically last 25+ years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarCalculator;

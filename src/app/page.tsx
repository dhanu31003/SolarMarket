'use client';

import React, { useState } from 'react';
import { Sun, Battery, Award, Zap, ChevronDown, Users, Leaf, DollarSign, Home, Lightbulb, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const { ref: benefitsRef, inView: benefitsIsVisible } = useInView({ triggerOnce: true });
  const { ref: savingsRef, inView: savingsIsVisible } = useInView({ triggerOnce: true });
  const { ref: testimonialsRef, inView: testimonialsIsVisible } = useInView({ triggerOnce: true });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Format the message for WhatsApp
    const message = `*New Contact Form Submission*%0A
Name: ${formData.name}%0A
Email: ${formData.email}%0A
Phone: ${formData.phone}%0A
Message: ${formData.message}`;

    // Your WhatsApp number (replace with your actual number with country code)
    const phoneNumber = '919030348946'; // Format: countrycode+number
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  // Benefits data
  const benefits = [
    {
      icon: <Leaf className="h-10 w-10 text-green-500" />,
      title: "Eco-Friendly Energy",
      description: "Reduce your carbon footprint and contribute to a cleaner environment by switching to renewable solar energy."
    },
    {
      icon: <DollarSign className="h-10 w-10 text-green-500" />,
      title: "Lower Electricity Bills",
      description: "Save up to 70% on your monthly electricity costs by harnessing free energy from the sun."
    },
    {
      icon: <Home className="h-10 w-10 text-green-500" />,
      title: "Increased Property Value",
      description: "Solar installations can increase your home&apos;s value by 4-6%, making it more attractive to future buyers."
    },
    {
      icon: <Zap className="h-10 w-10 text-green-500" />,
      title: "Energy Independence",
      description: "Reduce reliance on the grid and protect yourself from rising electricity costs and power outages."
    },
    {
      icon: <Award className="h-10 w-10 text-green-500" />,
      title: "Government Incentives",
      description: "Take advantage of tax credits, rebates, and incentives that make solar more affordable than ever."
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-green-500" />,
      title: "Low Maintenance",
      description: "Solar panels require minimal maintenance and typically come with 25+ year warranties."
    }
  ];

  // Savings data
  const savingsData = {
    monthlyAverage: "₹3,500",
    yearlyAverage: "₹42,000",
    twentyYearSavings: "₹12,00,000+",
    averageROI: "3-5 years",
    co2Reduction: "3-4 tonnes/year"
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      image: "/images/jpg1.jpeg", // Corrected path
      rating: 5,
      text: "Installing solar panels was the best decision we made for our home. Our electricity bill has reduced by 65% and the installation team was extremely professional."
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      image: "/images/jpg2.jpeg", // Corrected path
      rating: 5,
      text: "I was hesitant at first, but the team at SolarMarket made the whole process seamless. The quality of panels is excellent and the savings are real!"
    },
    {
      name: "Ananya Patel",
      location: "Ahmedabad",
      image: "/images/jpg3.jpeg", // Corrected path
      rating: 4,
      text: "From consultation to installation, everything was handled professionally. It&apos;s been a year now and our panels have performed better than expected."
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 px-4">
              Find the Perfect Solar Solution
            </h1>
            <p className="mt-4 text-xl text-gray-600 mb-8 max-w-3xl mx-auto px-4">
              Harness the power of the sun with India&apos;s premier solar marketplace. Compare top brands, save money, and contribute to a greener future.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors mx-auto sm:mx-0">
                Explore Products
              </Link>
              <a href="#contact-form" className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors mx-auto sm:mx-0">
                Get Free Consultation
              </a>
              <Link href="/blog" className="bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-yellow-700 transition-colors mx-auto sm:mx-0">
                Read Our Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Original) */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <Sun className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Top Brands</h3>
              <p className="text-gray-700">
                Choose from India&apos;s leading solar panel manufacturers
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Battery className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Easy Comparison</h3>
              <p className="text-gray-700">
                Compare specifications and prices easily
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Award className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Verified Quality</h3>
              <p className="text-gray-700">
                All products meet strict quality standards
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Expert Support</h3>
              <p className="text-gray-700">
                Get help with selection and installation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        ref={benefitsRef}
        className={`py-16 px-4 sm:px-6 lg:px-8 bg-white transition-opacity duration-1000 transform ${
          benefitsIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Benefits of Solar Energy</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Investing in solar energy brings numerous advantages to your home, finances, and the environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section 
        ref={savingsRef}
        className={`py-16 px-4 sm:px-6 lg:px-8 bg-blue-50 transition-opacity duration-1000 transform ${
          savingsIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Save Money with Solar</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              The financial benefits of switching to solar energy are significant and long-lasting.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-500 mb-2">Average Monthly Savings</h3>
                <p className="text-4xl font-bold text-green-600">{savingsData.monthlyAverage}</p>
                <p className="mt-2 text-gray-600">Based on 5kW system</p>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-500 mb-2">Yearly Savings</h3>
                <p className="text-4xl font-bold text-green-600">{savingsData.yearlyAverage}</p>
                <p className="mt-2 text-gray-600">Potential tax benefits not included</p>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-500 mb-2">25-Year Savings</h3>
                <p className="text-4xl font-bold text-green-600">{savingsData.twentyYearSavings}</p>
                <p className="mt-2 text-gray-600">With panel efficiency guarantee</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-t border-gray-200">
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-500 mb-2">Return on Investment</h3>
                <p className="text-4xl font-bold text-blue-600">{savingsData.averageROI}</p>
                <p className="mt-2 text-gray-600">For most residential installations</p>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-500 mb-2">CO₂ Reduction</h3>
                <p className="text-4xl font-bold text-blue-600">{savingsData.co2Reduction}</p>
                <p className="mt-2 text-gray-600">Equivalent to planting 100 trees annually</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/calculator" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
              Calculate your exact savings with our Solar Calculator
              <ChevronDown className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsRef}
        className={`py-16 px-4 sm:px-6 lg:px-8 bg-white transition-opacity duration-1000 transform ${
          testimonialsIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from homeowners who have already made the switch to solar energy with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link href="/testimonials" className="bg-transparent border border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              View More Testimonials
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Your Free Solar Consultation</h2>
              <p className="text-lg text-black mb-8">
                Curious about how much you could save with solar? Fill out this form and our experts will provide a free, no-obligation consultation tailored to your needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Over 10,000 satisfied customers</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Top-rated installation services</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Fast response within 24 hours</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Your Message or Questions</label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Tell us about your energy needs or any questions you have..."
                    required
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <span>Contact via WhatsApp</span>
                    <Zap className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="bg-green-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Embrace Solar Energy?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join thousands of homeowners who are saving money and helping the environment with solar energy solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products" className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors">
              Browse Solar Panels
            </Link>
            <Link href="/calculator" className="bg-green-800 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-900 transition-colors">
              Calculate Your Savings
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

//*export default HomePage;

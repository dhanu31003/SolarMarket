"use client";

import React, { useState } from 'react';
import { Sun, Award, Users, Workflow, Zap, Shield, Globe } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';

const AboutPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    adress: '',
    message: ''
  });

  const { ref: missionRef, inView: missionIsVisible } = useInView({ triggerOnce: true });
  const { ref: statsRef, inView: statsIsVisible } = useInView({ triggerOnce: true });
  const { ref: teamRef, inView: teamIsVisible } = useInView({ triggerOnce: true });

  const stats = [
    { number: '10K+', label: 'Solar Panels Sold', icon: Sun },
    { number: '95%', label: 'Customer Satisfaction', icon: Users },
    { number: '24/7', label: 'Customer Support', icon: Shield },
  ];

  const teamMembers = [
    {
      name: 'Alex Thompson',
      role: 'Founder & CEO',
      image: '/api/placeholder/400/400',
      quote: 'Building a sustainable future through solar innovation.'
    },
    {
      name: 'Sarah Chen',
      role: 'Chief Technology Officer',
      image: '/api/placeholder/400/400',
      quote: 'Pushing the boundaries of solar technology.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Customer Success',
      image: '/api/placeholder/400/400',
      quote: 'Every customer satisfaction is our priority.'
    }
  ];

  const handleGetStarted = () => {
    router.push('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = `*New Contact Form Submission*%0A
Name: ${formData.name}%0A
Email: ${formData.email}%0A
Phone: ${formData.phone}%0A
Adress: ${formData.adress}%0A
Message: ${formData.message}`;

    const phoneNumber = '919030348946';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    setFormData({
      name: '',
      email: '',
      phone: '',
      adress: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Powering Tomorrow's
            <span className="text-blue-600"> Sustainable Future</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            At SolarMarket, we're committed to making solar energy accessible, 
            affordable, and simple for everyone. Join us in the renewable energy revolution.
          </p>
        </div>
      </section>

      <section 
        ref={missionRef}
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${
          missionIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  We believe in a world powered by sustainable energy. Our mission is to accelerate
                  the world's transition to solar power by providing high-quality solar solutions
                  at competitive prices.
                </p>
                <div className="space-y-4">
                  {[ 'Premium Quality Products', 'Expert Installation Services', 'Lifetime Support', 'Sustainable Practices' ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <Zap className="h-5 w-5 text-blue-500 mr-3" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-64 md:h-full min-h-[400px]">
                <img
                  src="/api/placeholder/800/600"
                  alt="Solar Installation"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        ref={statsRef}
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${
          statsIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        ref={teamRef}
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${
          teamIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-64">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 mb-4">{member.role}</p>
                  <p className="text-gray-600 italic">"{member.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Adress</label>
                <input
                  type="text"
                  name="adress"
                  value={formData.adress}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                </div>
            </div>
            

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Message via WhatsApp
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

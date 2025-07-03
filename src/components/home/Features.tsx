import React from 'react';
import { MapPin, Star, Shield } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      title: "Curated Destinations",
      desc: "Hand-picked travel spots and unforgettable experiences around the world.",
      icon: <MapPin className="h-8 w-8 text-green-600" />,
    },
    {
      title: "Quality Assured",
      desc: "Verified reviews and high-rated guides ensure a quality experience.",
      icon: <Star className="h-8 w-8 text-green-600" />,
    },
    {
      title: "Secure Booking",
      desc: "Easy, safe, and fast booking system with secure payment options.",
      icon: <Shield className="h-8 w-8 text-green-600" />,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Why Choose TourPackage?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make travel planning simple and enjoyable with curated
            packages and premium experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-center"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-700 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
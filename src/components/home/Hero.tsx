import React from 'react';
import { Link } from 'react-router-dom';

interface HeroProps {
  isLoggedIn: boolean;
}

const Hero: React.FC<HeroProps> = ({ isLoggedIn }) => {
  return (
    <section className="relative bg-white py-20 px-6 sm:px-12 lg:px-20 overflow-hidden border-b">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80')`
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight animate-fadeInUp">
            Your Gateway to Breathtaking Journeys
          </h1>
          <p
            className="text-lg text-gray-600 max-w-lg animate-fadeInUp"
            style={{ animationDelay: "0.15s" }}
          >
            Handpicked experiences across the world. Trusted by thousands.
            Start your next chapter today.
          </p>
          <div
            className="flex flex-wrap gap-4 pt-2 animate-fadeInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/packages">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                Explore Packages
              </button>
            </Link>
            {!isLoggedIn && (
              <Link to="/auth">
                <button className="border border-green-600 text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-all">
                  Join Our Community
                </button>
              </Link>
            )}
          </div>
        </div>

        <StatsGrid />
      </div>
    </section>
  );
};

const StatsGrid: React.FC = () => {
  const stats = [
    {
      icon: "🌍",
      value: "50+",
      label: "Top Destinations",
    },
    {
      icon: "⭐",
      value: "4.9/5",
      label: "Average Rating",
    },
    {
      icon: "👥",
      value: "10K+",
      label: "Happy Travelers",
    },
    {
      icon: "🎒",
      value: "500+",
      label: "Booked Trips",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border border-gray-100 animate-fadeInUp hover:scale-105 transition-all"
          style={{
            animationDelay: `${0.4 + i * 0.15}s`,
            animationFillMode: "forwards",
          }}
        >
          <div className="text-3xl">{stat.icon}</div>
          <div>
            <div className="text-xl font-bold text-green-700">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hero;
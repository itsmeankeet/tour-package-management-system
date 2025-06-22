import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import PackageCard from "@/components/PackageCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, Star, Users, Shield } from "lucide-react";

interface Package {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  duration: string;
  image_url?: string;
}

const Index = () => {
  const { user, profile, isAdmin } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPackages();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFeaturedPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .limit(6)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("package_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setFavorites(data?.map((f) => f.package_id) || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const handleSearch = (query: string) => {
    // Navigate to packages page with search
    window.location.href = `/packages?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />

      {/* Hero Section */}

      <section className="relative bg-white py-20 px-6 sm:px-12 lg:px-20 overflow-hidden border-b">
        {/* Background Decorative Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80')`,
          }}
        ></div>

        {/* Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10">
          {/* Left: Text */}
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
              {!user && (
                <Link to="/auth">
                  <button className="border border-green-600 text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-all">
                    Join Our Community
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Right: Stats with Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
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
            ].map((stat, i) => (
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
                  <div className="text-xl font-bold text-green-700">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Message for Logged In Users */}
      {user && !isAdmin && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome back, {profile?.name}! 🌟
                </h2>
                <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                  We're your trusted travel partner, offering carefully curated
                  tour packages to the world's most amazing destinations. From
                  adventure treks to luxury getaways, we help you create
                  memories that last a lifetime.
                </p>
                <div className="mt-6">
                  <Link to="/dashboard">
                    <Button className="bg-green-600 hover:bg-green-700">
                      View My Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Features Section - Hide for Admin */}
      {!isAdmin && (
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
              {[
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
              ].map((item, index) => (
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
      )}

      {/* Featured Packages */}
      {packages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Tour Packages
              </h2>
              <p className="text-gray-600">
                Discover our most popular destinations and experiences
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      package={pkg}
                      isFavorite={favorites.includes(pkg.id)}
                      onFavoriteChange={fetchFavorites}
                    />
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link to="/packages">
                    <Button
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      View All Packages
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Call to Action - Hide for Admin */}
      {!user && (
        <section className="bg-gray-50 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Don’t Just Dream It, Book It
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mt-2 rounded-full" />
          </div>

          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-10 text-center">
            <p className="text-gray-700 text-lg mb-6">
              Join thousands of explorers discovering beautiful destinations.
              Sign in to unlock personalized tours and special offers.
            </p>
            <Link to="/auth">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition">
                Login Now
              </button>
            </Link>
          </div>
        </section>
      )}
      {/* Footer Section */}
      <footer className="bg-black relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-white grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Logo + Motto */}
          <div>
            <h2 className="text-3xl font-extrabold text-green-400 mb-2">
              TourVista
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Travel far, explore deeply, and create stories that last a
              lifetime. TourVista makes your journey magical.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/packages"
                  className="hover:text-green-400 transition-all"
                >
                  Packages
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-green-400 transition-all">
                  Home
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-green-400 transition-all">
                  About Us
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-green-400 transition-all">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact + Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm text-gray-300 mb-3">
              📧 support@tourvista.com
            </p>
            <p className="text-sm text-gray-300 mb-6">📞 +977 9812345678</p>

            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} TourVista. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;

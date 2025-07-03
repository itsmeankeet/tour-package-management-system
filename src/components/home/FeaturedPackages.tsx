import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PackageCard from "@/components/PackageCard";

interface Package {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  duration: string;
  image_url?: string;
}

interface FeaturedPackagesProps {
  packages: Package[];
  loading: boolean;
  favorites: string[];
  onFavoriteChange: () => void;
}

//creating a react functional component using typescript and accepting props
const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({
  packages,
  loading,
  favorites,
  onFavoriteChange,
}) => {
  if (packages.length === 0) return null;

  return (
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
                <div
                  key={pkg.id}
                  className="
                group
                relative
                overflow-hidden
                rounded-lg
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:shadow-2xl
                hover:-translate-y-1
                hover:scale-[1.02]
                hover: cursor-pointer
              "
                >
                  {/* Darken overlay on hover */}
                  <div
                    className="
                  absolute inset-0
                  bg-gradient-to-t from-black/30 to-transparent
                  opacity-0
                  group-hover:opacity-20
                  transition-opacity
                  duration-300
                "
                  />

                  <PackageCard
                    package={pkg}
                    isFavorite={favorites.includes(pkg.id)}
                    onFavoriteChange={onFavoriteChange}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/packages" className="inline-block group">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-700 text-white transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  View All Packages
                  <ArrowRight
                    className="
                  ml-2 h-5 w-5
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
                  />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedPackages;

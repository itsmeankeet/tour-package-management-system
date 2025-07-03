import React from 'react';
import { Heart, MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingSection from './BookingSection';

interface Package {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  duration: string;
  image_url?: string;
}

interface PackageHeaderProps {
  pkg: Package;
  reviews: Array<{ rating: number }>;
  isFavorite: boolean;
  isLoggedIn: boolean;
  onToggleFavorite: () => void;
  onBooking: (travelDate: string) => Promise<void>;
  onKhaltiPayment: () => void;
}

const PackageHeader: React.FC<PackageHeaderProps> = ({
  pkg,
  reviews,
  isFavorite,
  isLoggedIn,
  onToggleFavorite,
  onBooking,
  onKhaltiPayment,
}) => {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Image Section */}
      <div className="relative rounded-3xl shadow-2xl overflow-hidden">
        <div className="group relative h-96 overflow-hidden rounded-3xl">
          <img
            src={pkg.image_url || "/placeholder.svg"}
            alt={pkg.title}
            className="w-full h-full object-cover transform transition duration-500 group-hover:scale-105 rounded-3xl"
          />
          {isLoggedIn && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md backdrop-blur-sm"
              onClick={onToggleFavorite}
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </Button>
          )}
        </div>
      </div>

      {/* Package Details */}
      <div className="flex flex-col justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-green-700 leading-snug">
            {pkg.title}
          </h1>
          <p className="text-gray-700 text-base leading-relaxed">
            {pkg.description}
          </p>

          <div className="space-y-2">
            <div className="text-2xl font-extrabold text-green-600">
              Rs {pkg.price.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-green-500" />
              <span>{pkg.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-green-500" />
              <span>{pkg.duration}</span>
            </div>
            {reviews.length > 0 && (
              <div className="flex items-center gap-1 text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-500">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:max-w-sm">
          <BookingSection
            pkg={pkg}
            isLoggedIn={isLoggedIn}
            onBooking={onBooking}
            onKhaltiPayment={onKhaltiPayment}
          />
        </div>
      </div>
    </div>
  );
};

export default PackageHeader;

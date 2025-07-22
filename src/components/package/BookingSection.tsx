import React, { useState } from "react";
import { Calendar, CreditCard, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Package {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
}

interface BookingSectionProps {
  pkg: Package;
  isLoggedIn: boolean;
  onBooking: (travelDate: string) => Promise<void>;
  onKhaltiPayment: () => void;
}

const BookingSection: React.FC<BookingSectionProps> = ({
  pkg,
  isLoggedIn,
  onBooking,
  onKhaltiPayment,
}) => {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const [booking, setBooking] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleBookingSubmit = async () => {
    if (!travelDate) {
      toast({
        title: "Please select a date",
        description: "You must select a travel date to proceed with booking.",
        variant: "destructive"
      });
      return;
    }
    setBooking(true);
    try {
      await onBooking(travelDate);
      setShowBookingDialog(false);
      setTravelDate("");
    } finally {
      setBooking(false);
    }
  };

  const handleKhaltiPayment = () => {
    if (!travelDate) return;
    onKhaltiPayment();
  };

  if (!isLoggedIn) {
    return (
      <div className="p-4 bg-yellow-50 border rounded text-center text-yellow-800 text-sm">
        Please{" "}
        <a href="/auth" className="text-green-600 underline">
          sign in
        </a>{" "}
        to book this package.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Dialog onOpenChange={setShowBookingDialog}>
        <DialogTrigger asChild>
          <Button className="px-5 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md flex items-center gap-2 transition-all">
            <Calendar className="h-4 w-4" />
            Book Now
          </Button>
        </DialogTrigger>

        <DialogContent className="p-8 rounded-2xl bg-white shadow-xl max-w-md mx-auto backdrop-blur-md border border-green-100 space-y-6">
          {/* Title Section */}
          <div className="text-center space-y-2">
            <Calendar className="mx-auto h-10 w-10 text-green-500" />
            <h2 className="text-xl font-bold text-green-700">
              Book <span className="text-green-600">{pkg.title}</span>
            </h2>
            <div className="text-sm text-gray-600 flex justify-center gap-4">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-green-400" /> {pkg.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-green-400" /> {pkg.duration}
              </span>
            </div>
          </div>

          {/* Travel Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Travel Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              min={minDate}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 outline-none text-sm"
            />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-green-100 rounded-xl px-6 py-4 shadow-inner border border-green-200">
            <span className="text-sm text-gray-500 font-semibold tracking-wide">
              Total
            </span>
            <span className="text-xl font-extrabold text-green-700 tracking-tight">
              Rs {pkg.price.toLocaleString()}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleBookingSubmit}
              disabled={booking || !travelDate}
              className="flex-1 bg-white border border-green-300 text-green-700 hover:bg-green-50 font-semibold rounded-xl py-3 shadow-sm"
            >
              {booking ? "Booking..." : "Book & Pay Later"}
            </Button>
            <Button
              onClick={handleKhaltiPayment}
              disabled={!travelDate}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl py-3 shadow-sm flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4" /> Khalti
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingSection;

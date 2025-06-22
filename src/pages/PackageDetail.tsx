import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Star,
  Calendar,
  CreditCard,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Package {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  duration: string;
  image_url?: string;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  // Remove or make profiles optional:
  profiles?: {
    name: string;
  };
}

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [pkg, setPkg] = useState<Package | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [booking, setBooking] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [travelDate, setTravelDate] = useState("");

  // Fetch package details and check favorite
  useEffect(() => {
    if (id) {
      fetchPackageDetails();
      if (user) checkFavoriteStatus();
    }
    // eslint-disable-next-line
  }, [id, user]);

  // Fetch reviews after pkg loads
  useEffect(() => {
    if (pkg) fetchReviews();
    // eslint-disable-next-line
  }, [pkg]);

  // ------------------- API Functions -------------------

  const fetchPackageDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPkg(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Package not found",
        variant: "destructive",
      });
      navigate("/packages");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!pkg) return;
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(name)")
        .eq("package_id", pkg.id)
        .order("created_at", { ascending: false });

      console.log("Fetched reviews:", data, error); // <-- Add this
      setReviews(data || []);
    } catch (error: any) {
      console.error("Error fetching reviews:", error.message);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || !id) return;
    try {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("package_id", id)
        .single();
      setIsFavorite(!!data);
    } catch {
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add favorites.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("package_id", id);
        if (error) throw error;
        setIsFavorite(false);
        toast({ title: "Removed from favorites" });
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert([{ user_id: user.id, package_id: id }]);
        if (error) throw error;
        setIsFavorite(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBookingSubmit = async () => {
    if (!user || !pkg || !travelDate) {
      toast({
        title: "Missing information",
        description: "Please select a travel date",
        variant: "destructive",
      });
      return;
    }
    setBooking(true);
    try {
      const { error } = await supabase.from("bookings").insert([
        {
          user_id: user.id,
          package_id: id,
          travel_date: travelDate,
          total_amount: pkg.price,
          status: "pending",
        },
      ]);
      if (error) throw error;
      toast({
        title: "Booking successful!",
        description:
          "Your booking has been submitted and is pending confirmation.",
      });
      setShowBookingDialog(false);
      setTravelDate("");
    } catch (error: any) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setBooking(false);
    }
  };

  const initializeKhaltiPayment = () => {
    if (!pkg || !travelDate) {
      toast({
        title: "Missing information",
        description: "Please select a travel date first",
        variant: "destructive",
      });
      return;
    }
    // @ts-ignore
    const checkout = new window.KhaltiCheckout({
      publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a507256",
      productIdentity: pkg.id,
      productName: pkg.title,
      productUrl: window.location.href,
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
      eventHandler: {
        onSuccess: async (payload: any) => {
          try {
            const { error } = await supabase.from("bookings").insert([
              {
                user_id: user!.id,
                package_id: id,
                travel_date: travelDate,
                total_amount: pkg.price,
                payment_status: "completed",
                payment_method: "khalti",
                payment_reference: payload.token,
                status: "confirmed",
              },
            ]);
            if (error) throw error;
            toast({
              title: "Payment successful!",
              description: "Your booking has been confirmed.",
            });
            setShowBookingDialog(false);
            setTravelDate("");
          } catch (error: any) {
            toast({
              title: "Error saving booking",
              description: error.message,
              variant: "destructive",
            });
          }
        },
        onError: (error: any) => {
          toast({
            title: "Payment failed",
            description: "Please try again or contact support.",
            variant: "destructive",
          });
        },
        onClose: () => {},
      },
    });
    checkout.show({ amount: pkg.price * 100 });
  };

  const submitReview = async () => {
    if (!user || !reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      const { error } = await supabase.from("reviews").insert([
        {
          user_id: user.id,
          package_id: id,
          rating,
          comment: reviewText,
        },
      ]);
      if (error) throw error;
      setReviewText("");
      setRating(5);
      fetchReviews();
      toast({ title: "Review submitted successfully!" });
    } catch (error: any) {
      toast({
        title: "Error submitting review",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  // ------------------- Render UI -------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-12">
          <p className="text-gray-500">Package not found</p>
        </div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-green-100">
      <Navbar />

      <script
        src="https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.ejs.min.js"
        async
      ></script>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={pkg.image_url || "/placeholder.svg"}
              alt={pkg.title}
              className="w-full h-80 object-cover"
            />
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow"
                onClick={toggleFavorite}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </Button>
            )}
          </div>

          {/* Package Details */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-green-800">{pkg.title}</h1>
              <p className="text-gray-700 text-base leading-relaxed">
                {pkg.description}
              </p>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center font-semibold text-lg text-green-700">
                  <span className="h-4 w-4 mr-2" /> Rs {pkg.price}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-green-500" />{" "}
                  {pkg.location}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-green-500" />{" "}
                  {pkg.duration}
                </div>
                {reviews.length > 0 && (
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(averageRating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {averageRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Booking Section */}
            <div className="mt-6">
              {user ? (
                <Dialog
                  open={showBookingDialog}
                  onOpenChange={setShowBookingDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 py-3 text-lg font-bold rounded-2xl shadow-lg tracking-wide flex items-center gap-2 transition">
                      <Calendar className="h-5 w-5" /> Book Now
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="p-8 rounded-3xl shadow-2xl border-0 bg-white/95 backdrop-blur-md max-w-md mx-auto animate-in fade-in duration-300">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-2xl font-extrabold text-green-700 mb-2">
                        <Calendar className="h-7 w-7 text-green-600" />
                        Book <span className="text-green-500">{pkg.title}</span>
                      </DialogTitle>
                      <div className="text-gray-600 text-sm font-medium mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-400" />
                        {pkg.location}
                        <span className="mx-2 text-gray-300">|</span>
                        <Clock className="h-4 w-4 text-green-400" />
                        {pkg.duration}
                      </div>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Travel Date */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Calendar className="inline h-4 w-4 text-green-500" />
                          Travel Date
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Calendar className="h-5 w-5 text-green-500" />
                          </div>
                          <input
                            type="date"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            min={minDate}
                            className="w-full pl-11 pr-4 py-2 rounded-xl border border-green-200 bg-green-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 shadow-sm transition-all"
                          />
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="flex justify-between items-center bg-green-50 rounded-xl px-6 py-4 font-bold text-lg shadow-inner border border-green-100">
                        <span>Total</span>
                        <span className="text-green-700">Rs {pkg.price}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-2">
                        <Button
                          onClick={handleBookingSubmit}
                          disabled={booking || !travelDate}
                          variant="outline"
                          className="flex-1 py-3 rounded-xl font-bold border-green-400 hover:bg-green-50 transition text-green-700 text-base shadow"
                        >
                          {booking ? "Booking..." : "Book & Pay Later"}
                        </Button>
                        <Button
                          onClick={initializeKhaltiPayment}
                          disabled={!travelDate}
                          className="flex-1 py-3 text-base bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow transition"
                        >
                          Khalti
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="p-4 bg-yellow-50 border rounded text-center text-yellow-800 text-sm">
                  Please{" "}
                  <a href="/auth" className="text-green-600 underline">
                    sign in
                  </a>{" "}
                  to book this package.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            Reviews
          </h2>

          {user && (
            <Card className="mb-8 shadow-md">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Leave a Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Rating</label>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`h-6 w-6 ${
                            star <= rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          <Star className="h-full w-full fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Comment</label>
                    <Textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={3}
                      placeholder="Share your experience..."
                    />
                  </div>
                  <Button
                    onClick={submitReview}
                    disabled={submittingReview || !reviewText.trim()}
                    className="bg-green-600 hover:bg-green-700 text-sm py-2"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-5">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="shadow-sm border">
                  <CardContent className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        {/* <h4 className="font-medium text-gray-900">{review.profiles?.name || 'Anonymous'}</h4> */}
                        <h4 className="font-medium text-gray-900">
                          {review.profiles?.name || "Anonymous"}
                        </h4>

                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {review.comment}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;

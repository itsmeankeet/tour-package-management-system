import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import PackageHeader from '@/components/package/PackageHeader';
import BookingSection from '@/components/package/BookingSection';
import ReviewForm from '@/components/package/ReviewForm';
import ReviewList from '@/components/package/ReviewList';

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
  profiles?: {
    name: string;
  };
}

const PackageDetail = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [pkg, setPkg] = useState<Package | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) {
      fetchPackageDetails();
      if (user) checkFavoriteStatus();
    }
  }, [name, user]);

  const fetchPackageDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("title", name?.replace(/-/g, ' '))
        .single();

      if (error) throw error;
      setPkg(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Package not found',
        variant: 'destructive',
      });
      navigate('/packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pkg) fetchReviews();
  }, [pkg]);

  const fetchReviews = async () => {
    if (!pkg) return;
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(name)')
        .eq('package_id', pkg.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error('Error fetching reviews:', error.message);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || !pkg.id) return;
    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('package_id', pkg.id)
        .single();
      setIsFavorite(!!data);
    } catch {
      setIsFavorite(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add favorites.',
        variant: 'destructive',
      });
      return;
    }
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('package_id', pkg.id);
        if (error) throw error;
        setIsFavorite(false);
        toast({ title: 'Removed from favorites' });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, package_id: pkg.id }]);
        if (error) throw error;
        setIsFavorite(true);
        toast({ title: 'Added to favorites' });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleBooking = async (travelDate: string) => {
    if (!user || !pkg) {
      toast({
        title: 'Missing information',
        description: 'Please select a travel date',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('bookings').insert([
        {
          user_id: user.id,
          package_id: pkg.id,
          travel_date: travelDate,
          total_amount: pkg.price,
          status: 'pending',
        },
      ]);
      if (error) throw error;
      toast({
        title: 'Booking successful!',
        description: 'Your booking has been submitted and is pending confirmation.',
      });
    } catch (error: any) {
      toast({
        title: 'Booking failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleKhaltiPayment = async () => {
    if (!pkg) return;
  
    if (typeof window.KhaltiCheckout === 'undefined') {
      alert('Khalti script not loaded yet.');
      return;
    }
  
    const checkout = new window.KhaltiCheckout({
      publicKey: 'test_public_key_dc74e0fd57cb46cd93832aee0a507256',
      productIdentity: pkg.id.toString(),
      productName: pkg.title,
      productUrl: window.location.href,
      paymentPreference: ['KHALTI', 'EBANKING', 'MOBILE_BANKING', 'CONNECT_IPS', 'SCT'],
      eventHandler: {
        onSuccess: async (payload: any) => {
          try {
            // ✅ Verify payment with your backend before inserting booking
            const verifyRes = await fetch('/api/verify-khalti-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: payload.token, amount: payload.amount }),
            });
            const result = await verifyRes.json();
  
            if (!result.success) throw new Error('Payment verification failed');
  
            // ✅ Insert booking into Supabase
            const { error } = await supabase.from('bookings').insert([
              {
                user_id: user!.id,
                package_id: pkg.id,
                travel_date: selectedDate, // from your date picker
                total_amount: pkg.price,
                payment_status: 'completed',
                payment_method: 'khalti',
                payment_reference: payload.token,
                status: 'confirmed',
              },
            ]);
            if (error) throw error;
  
            toast({
              title: 'Payment successful!',
              description: 'Your booking has been confirmed.',
            });
          } catch (error: any) {
            toast({
              title: 'Error saving booking',
              description: error.message,
              variant: 'destructive',
            });
          }
        },
        onError: (error: any) => {
          toast({
            title: 'Payment failed',
            description: 'Please try again or contact support.',
            variant: 'destructive',
          });
        },
        onClose: () => {
          console.log('Payment popup closed');
        },
      },
    });
  
    checkout.show({ amount: pkg.price * 100 });
  };
  

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          user_id: user.id,
          package_id: pkg.id,
          rating,
          comment,
        },
      ]);
      if (error) throw error;
      fetchReviews();
      toast({ title: 'Review submitted successfully!' });
    } catch (error: any) {
      toast({
        title: 'Error submitting review',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-green-100">
      <Navbar />

      <script src="https://khalti.com/static/khalti-checkout.js"></script>


      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <PackageHeader
          pkg={pkg}
          reviews={reviews}
          isFavorite={isFavorite}
          isLoggedIn={!!user}
          onToggleFavorite={handleToggleFavorite}
          onBooking={handleBooking}
          onKhaltiPayment={handleKhaltiPayment}
        />

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Reviews</h2>

          {user && <ReviewForm onSubmit={handleReviewSubmit} />}
          
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BookingHeader } from "./booking/BookingHeader";
import { BookingCard } from "./booking/BookingCard";
import { EmptyBookings } from "./booking/EmptyBookings";

interface Booking {
  id: string;
  travel_date: string;
  status: string;
  payment_status: string;
  payment_method: string;
  payment_reference: string;
  total_amount: number;
  created_at: string;
  packages: {
    title: string;
    location: string;
  };
  profiles: {
    name: string;
    email: string;
  };
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          packages!inner(title, location),
          profiles!inner(name, email)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setUpdating(bookingId);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);

      if (error) throw error;

      await fetchBookings();
      toast({
        title: "Booking updated",
        description: `Booking ${status} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating booking",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const pendingBookingsCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-6">
      <BookingHeader pendingCount={pendingBookingsCount} />

      {bookings.length === 0 ? (
        <EmptyBookings />
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isUpdating={updating === booking.id}
              onUpdateStatus={updateBookingStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
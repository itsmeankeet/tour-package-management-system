import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { BookingCustomerActions } from "./BookingCustomerActions";
import { BookingPaymentInfo } from "./BookingPaymentInfo";

interface BookingCardProps {
  booking: {
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
  };
  isUpdating: boolean;
  onUpdateStatus: (bookingId: string, status: string) => void;
}

export const BookingCard = ({
  booking,
  isUpdating,
  onUpdateStatus,
}: BookingCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {booking.packages.title}
            </CardTitle>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{booking.packages.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <BookingStatusBadge status={booking.status} type="booking" />
            <BookingStatusBadge status={booking.payment_status} type="payment" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          <BookingCustomerActions
            name={booking.profiles.name}
            email={booking.profiles.email}
            travelDate={booking.travel_date}
            bookingId={booking.id}
            status={booking.status}
            isUpdating={isUpdating}
            onUpdateStatus={onUpdateStatus}
          />
          <BookingPaymentInfo
            totalAmount={booking.total_amount}
            paymentMethod={booking.payment_method}
            paymentReference={booking.payment_reference}
            createdAt={booking.created_at}
          />
        </div>
      </CardContent>
    </Card>
  );
};
import { DollarSign } from "lucide-react";

interface BookingPaymentInfoProps {
  totalAmount: number;
  paymentMethod?: string;
  paymentReference?: string;
  createdAt: string;
}

export const BookingPaymentInfo = ({
  totalAmount,
  paymentMethod,
  paymentReference,
  createdAt,
}: BookingPaymentInfoProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center text-green-600 font-semibold">
        <span>Rs {totalAmount}</span>
      </div>
      {paymentMethod && (
        <div className="text-sm text-gray-600">
          Payment: {paymentMethod}
          {paymentReference && (
            <div className="text-xs text-gray-500">
              Ref: {paymentReference}
            </div>
          )}
        </div>
      )}
      <div className="text-sm text-gray-500">
        Booked: {new Date(createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};
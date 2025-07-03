import { Calendar, User, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingCustomerActionsProps {
  name: string;
  email: string;
  travelDate: string;
  bookingId: string;
  status: string;
  isUpdating: boolean;
  onUpdateStatus: (bookingId: string, status: string) => void;
}

export const BookingCustomerActions = ({
  name,
  email,
  travelDate,
  bookingId,
  status,
  isUpdating,
  onUpdateStatus,
}: BookingCustomerActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-green-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Customer Info */}
      <div className="space-y-0.5 text-sm text-gray-700">
        <div className="flex items-center gap-2 font-medium">
          <User className="h-4 w-4 text-green-600" />
          {name}
        </div>
        <div className="text-xs text-gray-500">{email}</div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="h-3 w-3 text-green-500" />
          {new Date(travelDate).toLocaleDateString()}
        </div>
      </div>

      {/* Action Buttons */}
      {status === "pending" && (
        <div className="flex gap-2">
          <Button
            onClick={() => onUpdateStatus(bookingId, "confirmed")}
            disabled={isUpdating}
            className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md flex items-center gap-1 shadow-md"
          >
            <CheckCircle className="h-3 w-3" />
            {isUpdating ? "..." : "Accept"}
          </Button>
          <Button
            onClick={() => onUpdateStatus(bookingId, "rejected")}
            disabled={isUpdating}
            className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md flex items-center gap-1 shadow-md"
          >
            <XCircle className="h-3 w-3" />
            {isUpdating ? "..." : "Reject"}
          </Button>
        </div>
      )}
    </div>
  );
};

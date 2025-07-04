import { Badge } from "@/components/ui/badge";

interface BookingStatusBadgeProps {
  status: string;
  type: 'booking' | 'payment';
}

export const BookingStatusBadge = ({ status, type }: BookingStatusBadgeProps) => {
  const getStatusBadgeColor = (status: string, type: 'booking' | 'payment') => {
    if (type === 'booking') {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "confirmed":
          return "bg-green-100 text-green-800";
        case "rejected":
          return "bg-red-100 text-red-800";
        case "cancelled":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "completed":
          return "bg-green-100 text-green-800";
        case "failed":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  const displayText = type === 'payment' 
    ? `Payment: {status}`
    : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge className={getStatusBadgeColor(status, type)}>
      {displayText}
    </Badge>
  );
};
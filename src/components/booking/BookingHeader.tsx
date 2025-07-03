import { Badge } from "@/components/ui/badge";

interface BookingHeaderProps {
  pendingCount: number;
}

export const BookingHeader = ({ pendingCount }: BookingHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
      <Badge variant="outline">{pendingCount} Pending</Badge>
    </div>
  );
};
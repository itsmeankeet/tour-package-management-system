import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const EmptyBookings = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No bookings found</p>
      </CardContent>
    </Card>
  );
};
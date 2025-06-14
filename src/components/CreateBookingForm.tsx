
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { useCreateBooking, CreateBookingData } from "@/hooks/useCreateBooking";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CreateBookingForm = () => {
  const [formData, setFormData] = useState<CreateBookingData>({
    customer_id: "",
    hotel_id: "",
    booking_reference: `BK-${Date.now()}`,
    destination: "",
    start_date: "",
    end_date: "",
    number_of_guests: 1,
    number_of_rooms: 1,
    total_amount: 0,
    status: "Pending",
    regime: "Room Only",
    special_requests: ""
  });
  
  const createBooking = useCreateBooking();

  // Fetch customers for dropdown
  const { data: customers = [] } = useQuery({
    queryKey: ['customers-for-booking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch hotels for dropdown
  const { data: hotels = [] } = useQuery({
    queryKey: ['hotels-for-booking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('id, name, location')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customer_id">Customer *</Label>
          <Select value={formData.customer_id} onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="hotel_id">Hotel</Label>
          <Select value={formData.hotel_id} onValueChange={(value) => setFormData(prev => ({ ...prev, hotel_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select hotel (optional)" />
            </SelectTrigger>
            <SelectContent>
              {hotels.map((hotel) => (
                <SelectItem key={hotel.id} value={hotel.id}>
                  {hotel.name} - {hotel.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="booking_reference">Booking Reference *</Label>
          <Input
            id="booking_reference"
            value={formData.booking_reference}
            onChange={(e) => setFormData(prev => ({ ...prev, booking_reference: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="destination">Destination *</Label>
          <Input
            id="destination"
            value={formData.destination}
            onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date *</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="number_of_guests">Number of Guests *</Label>
          <Input
            id="number_of_guests"
            type="number"
            min="1"
            value={formData.number_of_guests}
            onChange={(e) => setFormData(prev => ({ ...prev, number_of_guests: parseInt(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="number_of_rooms">Number of Rooms</Label>
          <Input
            id="number_of_rooms"
            type="number"
            min="1"
            value={formData.number_of_rooms}
            onChange={(e) => setFormData(prev => ({ ...prev, number_of_rooms: parseInt(e.target.value) }))}
          />
        </div>
        <div>
          <Label htmlFor="total_amount">Total Amount ($) *</Label>
          <Input
            id="total_amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.total_amount}
            onChange={(e) => setFormData(prev => ({ ...prev, total_amount: parseFloat(e.target.value) }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="regime">Regime</Label>
          <Select value={formData.regime} onValueChange={(value) => setFormData(prev => ({ ...prev, regime: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Room Only">Room Only</SelectItem>
              <SelectItem value="Bed & Breakfast">Bed & Breakfast</SelectItem>
              <SelectItem value="Half Board">Half Board</SelectItem>
              <SelectItem value="Full Board">Full Board</SelectItem>
              <SelectItem value="All Inclusive">All Inclusive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="special_requests">Special Requests</Label>
        <Textarea
          id="special_requests"
          value={formData.special_requests}
          onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={createBooking.isPending}>
          {createBooking.isPending ? "Creating..." : "Create Booking"}
        </Button>
      </div>
    </form>
  );
};

export default CreateBookingForm;

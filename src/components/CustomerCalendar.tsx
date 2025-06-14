
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isSameDay } from "date-fns";

interface BookingEvent {
  id: string;
  customer_name: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: string;
}

const CustomerCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['calendar-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_date,
          end_date,
          destination,
          status,
          customer:customers(name)
        `)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data.map(booking => ({
        id: booking.id,
        customer_name: booking.customer?.name || 'Unknown',
        destination: booking.destination,
        start_date: booking.start_date,
        end_date: booking.end_date,
        status: booking.status
      })) as BookingEvent[];
    },
  });

  const getEventsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const startDate = parseISO(booking.start_date);
      const endDate = parseISO(booking.end_date);
      return date >= startDate && date <= endDate;
    });
  };

  const getDatesWithEvents = () => {
    const dates: Date[] = [];
    bookings.forEach(booking => {
      const start = parseISO(booking.start_date);
      const end = parseISO(booking.end_date);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    });
    return dates;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      case "Completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">Loading calendar...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Travel Calendar</CardTitle>
          <CardDescription>
            View all customer travel dates and bookings in calendar format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasEvents: getDatesWithEvents()
                }}
                modifiersStyles={{
                  hasEvents: { 
                    backgroundColor: '#dbeafe', 
                    color: '#1e40af',
                    fontWeight: 'bold' 
                  }
                }}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
              </h3>
              
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <Card key={event.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {event.customer_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{event.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{event.destination}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(event.start_date), 'MMM d')} - {format(parseISO(event.end_date), 'MMM d')}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No events on this date</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerCalendar;

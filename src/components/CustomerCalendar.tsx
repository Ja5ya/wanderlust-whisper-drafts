import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays, addWeeks, addMonths, subWeeks, subMonths, isToday, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingEvent {
  id: string;
  customer_id: string;
  customer_name: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: string;
}

type ViewType = 'month' | 'week';

const CustomerCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['calendar-bookings'],
    queryFn: async () => {
      console.log('Fetching bookings for calendar...');
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          customer_id,
          start_date,
          end_date,
          destination,
          status,
          customers!bookings_customer_id_fkey(name)
        `)
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      
      console.log('Fetched bookings:', data);
      return data.map(booking => ({
        id: booking.id,
        customer_id: booking.customer_id,
        customer_name: booking.customers?.name || 'Unknown',
        destination: booking.destination,
        start_date: booking.start_date,
        end_date: booking.end_date,
        status: booking.status
      })) as BookingEvent[];
    },
  });

  // Generate consistent colors for customers
  const getCustomerColor = (customerId: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-cyan-500'
    ];
    
    // Create a simple hash from customer ID to ensure consistent colors
    let hash = 0;
    for (let i = 0; i < customerId.length; i++) {
      hash = customerId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getEventsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const startDate = parseISO(booking.start_date);
      const endDate = parseISO(booking.end_date);
      return date >= startDate && date <= endDate;
    });
  };

  const handleEventClick = (event: BookingEvent) => {
    navigate(`/customer/${event.customer_id}`);
  };

  function getCalendarDays() {
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }
  }

  function navigateCalendar(direction: 'prev' | 'next') {
    if (view === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    }
  }

  const calendarDays = getCalendarDays();
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Travel Calendar</CardTitle>
              <CardDescription>
                View all customer travel dates and bookings ({bookings.length} bookings found)
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                onClick={() => setView('month')}
                size="sm"
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                onClick={() => setView('week')}
                size="sm"
              >
                Week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateCalendar('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateCalendar('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {view === 'month' 
                    ? format(currentDate, 'MMMM yyyy')
                    : `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`
                  }
                </h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="border rounded-lg overflow-hidden">
              {/* Days Header */}
              <div className="grid grid-cols-7 bg-gray-50">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="p-3 text-sm font-medium text-center border-r last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className={`grid grid-cols-7 ${view === 'week' ? 'min-h-[400px]' : ''}`}>
                {calendarDays.map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  const isCurrentMonth = view === 'month' ? isSameMonth(day, currentDate) : true;
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  
                  return (
                    <div
                      key={index}
                      className={`
                        border-r border-b last:border-r-0 p-2 cursor-pointer hover:bg-gray-50 transition-colors
                        ${view === 'week' ? 'min-h-[100px]' : 'min-h-[80px]'}
                        ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                        ${isSelected ? 'bg-blue-50 ring-1 ring-blue-200' : ''}
                        ${isToday(day) ? 'bg-blue-100' : ''}
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={`text-sm font-medium mb-2 ${isToday(day) ? 'text-blue-600' : ''}`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, view === 'week' ? 8 : 4).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded-full text-white cursor-pointer hover:opacity-80 transition-opacity ${getCustomerColor(event.customer_id)}`}
                            title={`${event.customer_name} - ${event.destination}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            <div className="truncate">{event.customer_name}</div>
                          </div>
                        ))}
                        {dayEvents.length > (view === 'week' ? 8 : 4) && (
                          <div className="text-xs text-gray-500 px-2">
                            +{dayEvents.length - (view === 'week' ? 8 : 4)} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Events */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Events for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => (
                        <Card 
                          key={event.id} 
                          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full ${getCustomerColor(event.customer_id)}`}></div>
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
                            <Badge variant="secondary" className="text-white bg-green-500">
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
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerCalendar;

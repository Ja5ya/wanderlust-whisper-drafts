
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays, addWeeks, addMonths, subWeeks, subMonths, isToday, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingEvent {
  id: string;
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

  const getCalendarDays = () => {
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    if (view === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-500";
      case "Pending": return "bg-yellow-500";
      case "Cancelled": return "bg-red-500";
      case "Completed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

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
                View all customer travel dates and bookings
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
                      <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-blue-600' : ''}`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, view === 'week' ? 6 : 3).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded text-white truncate ${getStatusColor(event.status)}`}
                            title={`${event.customer_name} - ${event.destination}`}
                          >
                            {event.customer_name}
                          </div>
                        ))}
                        {dayEvents.length > (view === 'week' ? 6 : 3) && (
                          <div className="text-xs text-gray-500 px-2">
                            +{dayEvents.length - (view === 'week' ? 6 : 3)} more
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

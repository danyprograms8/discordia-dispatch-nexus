
import { useState, useEffect, useMemo } from "react";
import { format, startOfMonth, endOfMonth, isSameDay, addMonths, parseISO } from "date-fns";
import { PopoverContent } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { FilterContent } from "@/components/calendar/FilterContent";
import { MonthView } from "@/components/calendar/MonthView";
import { WeekView } from "@/components/calendar/WeekView";
import { DayView } from "@/components/calendar/DayView";
import { EventDetailModal } from "@/components/calendar/EventDetailModal";
import { LoadingState } from "@/components/calendar/LoadingState";
import { CalendarEvent } from "@/components/calendar/types";

const CalendarPage = () => {
  // State management
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [statusFilter, setStatusFilter] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Mock data for events
  useEffect(() => {
    // Simulate loading state
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const mockEvents: CalendarEvent[] = [
        {
          id: "1",
          loadNumber: "BL1234",
          title: "ABC Logistics - #BL1234",
          date: "2025-05-14",
          type: "pickup",
          location: "Dallas, TX",
          driver: "John Doe",
          status: "booked",
          rate: "$2,400"
        },
        {
          id: "2",
          loadNumber: "BL1234",
          title: "ABC Logistics - #BL1234",
          date: "2025-05-15",
          type: "delivery",
          location: "Houston, TX",
          driver: "John Doe",
          status: "booked",
          rate: "$2,400"
        },
        {
          id: "3",
          loadNumber: "XYZ5678",
          title: "XYZ Transport - #XYZ5678",
          date: "2025-05-15",
          type: "pickup",
          location: "Chicago, IL",
          driver: "Mike Johnson",
          status: "assigned",
          rate: "$3,200"
        },
        {
          id: "4",
          loadNumber: "XYZ5678",
          title: "XYZ Transport - #XYZ5678",
          date: "2025-05-16",
          type: "delivery",
          location: "Detroit, MI",
          driver: "Mike Johnson",
          status: "assigned",
          rate: "$3,200"
        },
        {
          id: "5",
          loadNumber: "FF9012",
          title: "FastFreight - #FF9012",
          date: "2025-05-17",
          type: "pickup",
          location: "Atlanta, GA",
          driver: "Sarah Williams",
          status: "in-transit",
          rate: "$1,850"
        },
        {
          id: "6",
          loadNumber: "FF9012",
          title: "FastFreight - #FF9012",
          date: "2025-05-19",
          type: "delivery",
          location: "Miami, FL",
          driver: "Sarah Williams",
          status: "in-transit",
          rate: "$1,850"
        },
      ];
      
      setEvents(mockEvents);
      setLoading(false);
    }, 500); // Simulate short loading time
    
  }, []);

  // Extract unique drivers from events for driver filter
  const drivers = useMemo(() => {
    return Array.from(new Set(events.map((event) => event.driver)));
  }, [events]);

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Status filter
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      
      // Driver filter
      const matchesDriver = driverFilter === "all" || event.driver === driverFilter;
      
      // Date range filter
      let matchesDateRange = true;
      if (dateRangeStart && dateRangeEnd) {
        const eventDate = new Date(event.date);
        const startDate = new Date(dateRangeStart);
        const endDate = new Date(dateRangeEnd);
        
        // Set hours to 0 for proper comparison
        eventDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        matchesDateRange = eventDate >= startDate && eventDate <= endDate;
      }
      
      return matchesStatus && matchesDriver && matchesDateRange;
    });
  }, [events, statusFilter, driverFilter, dateRangeStart, dateRangeEnd]);

  // Calculate weekly events for week view
  const weeklyEvents = useMemo(() => {
    if (view !== 'week') return [];
    
    // Create a date range for the current week
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday
    
    // Format dates for comparison
    const startDateStr = format(startOfWeek, 'yyyy-MM-dd');
    const endDateStr = format(endOfWeek, 'yyyy-MM-dd');
    
    // Filter events that fall within this week
    return filteredEvents.filter(event => {
      const eventDate = event.date;
      return eventDate >= startDateStr && eventDate <= endDateStr;
    });
  }, [filteredEvents, date, view]);

  // Calculate daily events for day view
  const dailyEvents = useMemo(() => {
    if (view !== 'day') return [];
    
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredEvents.filter(event => event.date === dateStr);
  }, [filteredEvents, date, view]);

  // Helper functions
  const getEventTypeColor = (type: string, status: string) => {
    if (type === "pickup") {
      switch (status) {
        case "booked": return "bg-blue-500 bg-opacity-20 border-blue-300";
        case "assigned": return "bg-purple-500 bg-opacity-20 border-purple-300";
        case "in-transit": return "bg-yellow-500 bg-opacity-20 border-yellow-300";
        default: return "bg-gray-500 bg-opacity-20 border-gray-300";
      }
    } else {
      switch (status) {
        case "booked": return "bg-blue-500 bg-opacity-20 border-blue-300";
        case "assigned": return "bg-purple-500 bg-opacity-20 border-purple-300";
        case "in-transit": return "bg-yellow-500 bg-opacity-20 border-yellow-300";
        case "delivered": return "bg-green-500 bg-opacity-20 border-green-300";
        default: return "bg-gray-500 bg-opacity-20 border-gray-300";
      }
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "booked": return "bg-blue-500 bg-opacity-20 text-blue-300 border-blue-300";
      case "assigned": return "bg-purple-500 bg-opacity-20 text-purple-300 border-purple-300";
      case "in-transit": return "bg-yellow-500 bg-opacity-20 text-yellow-300 border-yellow-300";
      case "delivered": return "bg-green-500 bg-opacity-20 text-green-300 border-green-300";
      case "cancelled": return "bg-red-500 bg-opacity-20 text-red-300 border-red-300";
      default: return "bg-gray-500 bg-opacity-20 text-gray-300 border-gray-300";
    }
  };

  const handlePrevious = () => {
    if (view === "month") {
      setDate(addMonths(date, -1));
    } else if (view === "week") {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - 7);
      setDate(newDate);
    } else {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - 1);
      setDate(newDate);
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setDate(addMonths(date, 1));
    } else if (view === "week") {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + 7);
      setDate(newDate);
    } else {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + 1);
      setDate(newDate);
    }
  };

  const handleReset = () => {
    setStatusFilter("all");
    setDriverFilter("all");
    setDateRangeStart("");
    setDateRangeEnd("");
    setIsFilterOpen(false);
    
    toast("Filters reset", {
      description: "All filters have been cleared"
    });
  };

  const handleApplyFilters = () => {
    // Validate date range
    if (dateRangeStart && dateRangeEnd) {
      const startDate = new Date(dateRangeStart);
      const endDate = new Date(dateRangeEnd);
      
      if (startDate > endDate) {
        toast("Invalid date range", {
          description: "Start date must be before end date",
          className: "destructive-toast"
        });
        return;
      }
    }
    
    setIsFilterOpen(false);
    
    toast("Filters applied", {
      description: "Calendar view has been updated"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-discord-text">Calendar</h1>
        <p className="text-discord-muted">View and manage your load schedule</p>
      </div>

      {/* Calendar Controls */}
      <CalendarHeader 
        date={date}
        view={view}
        statusFilter={statusFilter}
        driverFilter={driverFilter}
        dateRangeStart={dateRangeStart}
        dateRangeEnd={dateRangeEnd}
        isFilterOpen={isFilterOpen}
        setDate={setDate}
        setView={setView}
        setIsFilterOpen={setIsFilterOpen}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      />

      {/* Calendar Filters Popover Content */}
      <PopoverContent className="w-96 p-4 bg-discord-background border-discord-background">
        <FilterContent 
          statusFilter={statusFilter}
          driverFilter={driverFilter}
          dateRangeStart={dateRangeStart}
          dateRangeEnd={dateRangeEnd}
          drivers={drivers}
          setStatusFilter={setStatusFilter}
          setDriverFilter={setDriverFilter}
          setDateRangeStart={setDateRangeStart}
          setDateRangeEnd={setDateRangeEnd}
          handleReset={handleReset}
          handleApplyFilters={handleApplyFilters}
        />
      </PopoverContent>

      {/* Loading State */}
      {loading ? (
        <LoadingState />
      ) : (
        <>
          {/* Calendar Views */}
          {view === "month" && (
            <MonthView 
              date={date} 
              setDate={setDate} 
              filteredEvents={filteredEvents} 
              setSelectedEvent={setSelectedEvent} 
            />
          )}

          {/* Week View */}
          {view === "week" && (
            <WeekView 
              weeklyEvents={weeklyEvents} 
              getStatusBadgeColor={getStatusBadgeColor}
              setSelectedEvent={setSelectedEvent}
            />
          )}

          {/* Day View */}
          {view === "day" && (
            <DayView 
              date={date}
              dailyEvents={dailyEvents}
              setSelectedEvent={setSelectedEvent}
              getEventTypeColor={getEventTypeColor}
              getStatusBadgeColor={getStatusBadgeColor}
            />
          )}
        </>
      )}

      {/* Event Detail Modal */}
      <EventDetailModal 
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        getEventTypeColor={getEventTypeColor}
        getStatusBadgeColor={getStatusBadgeColor}
      />
    </div>
  );
};

export default CalendarPage;

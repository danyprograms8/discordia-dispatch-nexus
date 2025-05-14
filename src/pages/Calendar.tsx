import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarComponent,
  CalendarClock,
  Truck,
  ChevronLeft,
  ChevronRight,
  FilterIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// Mock data for calendar events
const mockEvents = [
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

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [statusFilter, setStatusFilter] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get unique drivers from mock data
  const drivers = Array.from(new Set(mockEvents.map((event) => event.driver)));

  // Filter events based on selected filters
  const filterEvents = (events) => {
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
  };

  // Filter events based on the selected date and other filters
  const getEventsForDate = (dateValue) => {
    const dateString = format(dateValue, "yyyy-MM-dd");
    
    return filterEvents(mockEvents).filter(event => event.date === dateString);
  };

  // Get all events based on all filters (for list view)
  const getAllFilteredEvents = () => {
    return filterEvents(mockEvents);
  };

  const getEventTypeColor = (type, status) => {
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

  const handlePrevious = () => {
    const newDate = new Date(date);
    if (view === "month") {
      newDate.setMonth(date.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(date.getDate() - 7);
    } else {
      newDate.setDate(date.getDate() - 1);
    }
    setDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (view === "month") {
      newDate.setMonth(date.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(date.getDate() + 7);
    } else {
      newDate.setDate(date.getDate() + 1);
    }
    setDate(newDate);
  };

  const handleReset = () => {
    setStatusFilter("all");
    setDriverFilter("all");
    setDateRangeStart("");
    setDateRangeEnd("");
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-discord-text">Calendar</h1>
        <p className="text-discord-muted">View and manage your load schedule</p>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrevious}
            className="border-discord-background bg-discord-secondary text-discord-text"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-discord-text font-medium">
            {format(date, view === "month" ? "MMMM yyyy" : view === "week" ? "'Week of' MMM d, yyyy" : "EEEE, MMM d, yyyy")}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNext}
            className="border-discord-background bg-discord-secondary text-discord-text"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={view} onValueChange={(value) => setView(value)}>
            <SelectTrigger className="w-[120px] bg-discord-secondary border-discord-background">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent className="bg-discord-background border-discord-background">
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-discord-secondary border-discord-background flex items-center gap-1"
              >
                <FilterIcon className="h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-4 bg-discord-background border-discord-background">
              <div className="space-y-4">
                <h4 className="font-medium text-discord-text">Filters</h4>
                
                <div className="space-y-2">
                  <label className="text-sm text-discord-muted">Date Range</label>
                  <div className="flex items-center space-x-2">
                    <div>
                      <div className="text-xs text-discord-muted">From</div>
                      <Input
                        type="date"
                        value={dateRangeStart}
                        onChange={(e) => setDateRangeStart(e.target.value)}
                        className="bg-discord-secondary border-discord-background text-discord-text"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-discord-muted">To</div>
                      <Input
                        type="date"
                        value={dateRangeEnd}
                        onChange={(e) => setDateRangeEnd(e.target.value)}
                        className="bg-discord-secondary border-discord-background text-discord-text"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-discord-muted">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full bg-discord-secondary border-discord-background">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-discord-background border-discord-background">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-discord-muted">Driver</label>
                  <Select value={driverFilter} onValueChange={setDriverFilter}>
                    <SelectTrigger className="w-full bg-discord-secondary border-discord-background">
                      <SelectValue placeholder="All Drivers" />
                    </SelectTrigger>
                    <SelectContent className="bg-discord-background border-discord-background">
                      <SelectItem value="all">All Drivers</SelectItem>
                      {drivers.map((driver) => (
                        <SelectItem key={driver} value={driver}>{driver}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="text-discord-muted hover:text-discord-text"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="bg-discord-accent hover:bg-discord-accent/80 text-white"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Calendar View */}
      {view === "month" && (
        <Card className="bg-discord-secondary border-discord-background">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => day && setDate(day)}
              className="rounded-md pointer-events-auto"
              classNames={{
                months: "space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center bg-discord-secondary text-discord-text",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-discord-background text-discord-text hover:bg-discord-background",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-discord-muted w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-discord-accent/20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                day_selected: "bg-discord-accent text-white hover:bg-discord-accent/80 hover:text-white",
                day_today: "bg-discord-background text-discord-text",
                day_outside: "text-discord-muted opacity-50",
                day_disabled: "text-discord-muted opacity-50",
                day_range_middle: "aria-selected:bg-discord-accent aria-selected:text-primary-foreground",
                day_hidden: "invisible",
              }}
              components={{
                Day: ({ date: dayDate, ...props }) => {
                  const events = getEventsForDate(dayDate);
                  const hasEvents = events.length > 0;
                  
                  return (
                    <div className="relative p-0 w-full h-full" {...props}>
                      <div className="absolute top-0 left-0 w-9 h-9 flex items-center justify-center">
                        {format(dayDate, "d")}
                      </div>
                      {hasEvents && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 cursor-pointer">
                              <div className="flex space-x-0.5">
                                {events.slice(0, 3).map((event, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      event.type === "pickup" 
                                        ? "bg-blue-400" 
                                        : "bg-green-400"
                                    }`}
                                  />
                                ))}
                                {events.length > 3 && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-discord-muted" />
                                )}
                              </div>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent 
                            className="w-80 p-0 bg-discord-background border-discord-background"
                            align="start"
                          >
                            <div className="p-2 border-b border-discord-secondary">
                              <h3 className="font-medium text-discord-text">
                                {format(dayDate, "EEEE, MMMM d, yyyy")}
                              </h3>
                              <p className="text-xs text-discord-muted">
                                {events.length} {events.length === 1 ? "event" : "events"}
                              </p>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              {events.map((event) => (
                                <div 
                                  key={event.id} 
                                  className="p-2 border-b border-discord-secondary hover:bg-discord-secondary cursor-pointer"
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  <div className="flex items-center space-x-2">
                                    {event.type === "pickup" ? (
                                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    ) : (
                                      <div className="w-2 h-2 rounded-full bg-green-400" />
                                    )}
                                    <span className="text-discord-text font-medium">Load #{event.loadNumber}</span>
                                  </div>
                                  <div className="ml-4 text-xs text-discord-muted">
                                    <div className="flex items-center space-x-1">
                                      <Truck className="h-3 w-3" />
                                      <span>
                                        {event.type === "pickup" ? "Pickup" : "Delivery"}: {event.location}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <CalendarClock className="h-3 w-3" />
                                      <span>Rate: {event.rate}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* List View (for week or day) */}
      {(view === "week" || view === "day") && (
        <Card className="bg-discord-secondary border-discord-background">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 font-medium text-discord-muted mb-2 px-2">
              <div>Load #</div>
              <div>Date</div>
              <div>Rate</div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getAllFilteredEvents().length > 0 ? (
                getAllFilteredEvents().map((event) => (
                  <div 
                    key={event.id}
                    className="p-2 rounded-md hover:bg-discord-background cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${event.type === "pickup" ? "bg-blue-400" : "bg-green-400"}`} />
                        <span className="text-discord-text">{event.loadNumber}</span>
                      </div>
                      <div className="text-discord-text">
                        {format(new Date(event.date), "MMM d, yyyy")}
                        <div className="text-xs text-discord-muted">
                          {event.type === "pickup" ? "Pickup" : "Delivery"}
                        </div>
                      </div>
                      <div className="text-discord-text">{event.rate}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-discord-muted">
                  No loads found for the selected filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Detail Popover */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
          <div className="bg-discord-secondary p-6 rounded-lg w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-discord-text">Load #{selectedEvent.loadNumber}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                <span className="sr-only">Close</span>
                <span aria-hidden="true">&times;</span>
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getEventTypeColor(selectedEvent.type, selectedEvent.status)}>
                  {selectedEvent.type === "pickup" ? "Pickup" : "Delivery"}
                </Badge>
                <Badge variant="outline" className="bg-discord-background">
                  {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1).replace("-", " ")}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-discord-text">
                  <CalendarComponent className="h-4 w-4 mr-2 text-discord-muted" />
                  {format(new Date(selectedEvent.date), "EEEE, MMMM d, yyyy")}
                </div>
                <div className="flex items-center text-discord-text">
                  <Truck className="h-4 w-4 mr-2 text-discord-muted" />
                  {selectedEvent.location}
                </div>
                <div className="flex items-center text-discord-text">
                  <CalendarClock className="h-4 w-4 mr-2 text-discord-muted" />
                  Rate: {selectedEvent.rate}
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  className="text-discord-muted hover:text-discord-text"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </Button>
                <Button
                  className="bg-discord-accent hover:bg-discord-accent/80 text-white"
                  onClick={() => {
                    // Navigate to the load detail page in a real app
                    setSelectedEvent(null);
                  }}
                >
                  View Load
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
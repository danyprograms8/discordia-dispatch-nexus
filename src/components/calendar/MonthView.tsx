
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Truck } from "lucide-react";
import { CalendarEvent } from "./types";

type MonthViewProps = {
  date: Date;
  setDate: (date: Date) => void;
  filteredEvents: CalendarEvent[];
  setSelectedEvent: (event: CalendarEvent | null) => void;
};

export const MonthView = ({ date, setDate, filteredEvents, setSelectedEvent }: MonthViewProps) => {
  const getEventsForDate = (dateValue: Date) => {
    const dateString = format(dateValue, "yyyy-MM-dd");
    return filteredEvents.filter(event => event.date === dateString);
  };

  return (
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
              const dayEvents = getEventsForDate(dayDate);
              const hasEvents = dayEvents.length > 0;
              
              return (
                <div className="relative p-0 w-full h-full" {...props}>
                  <div className="absolute top-0 left-0 right-0 w-full h-9 flex items-center justify-center">
                    {format(dayDate, "d")}
                  </div>
                  {hasEvents && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 cursor-pointer">
                          <div className="flex space-x-0.5">
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div 
                                key={i} 
                                className={`w-1.5 h-1.5 rounded-full ${
                                  event.type === "pickup" 
                                    ? "bg-blue-400" 
                                    : "bg-green-400"
                                }`}
                              />
                            ))}
                            {dayEvents.length > 3 && (
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
                            {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
                          </p>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {dayEvents.map((event) => (
                            <div 
                              key={event.id} 
                              className="p-2 border-b border-discord-secondary hover:bg-discord-secondary cursor-pointer"
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {event.type === "pickup" ? (
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                  )}
                                  <span className="text-discord-text font-medium">Load #{event.loadNumber}</span>
                                </div>
                                <span className="text-discord-text font-medium">{event.rate}</span>
                              </div>
                              <div className="ml-4 text-xs text-discord-muted mt-1">
                                <div className="flex items-center space-x-1">
                                  <Truck className="h-3 w-3" />
                                  <span>
                                    {event.type === "pickup" ? "Pickup" : "Delivery"}: {event.location}
                                  </span>
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
  );
};

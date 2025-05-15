
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Truck } from "lucide-react";
import { CalendarEvent } from "./types";

type DayViewProps = {
  date: Date;
  dailyEvents: CalendarEvent[];
  setSelectedEvent: (event: CalendarEvent | null) => void;
  getEventTypeColor: (type: string, status: string) => string;
  getStatusBadgeColor: (status: string) => string;
};

export const DayView = ({ 
  date, 
  dailyEvents, 
  setSelectedEvent,
  getEventTypeColor,
  getStatusBadgeColor
}: DayViewProps) => {
  return (
    <Card className="bg-discord-secondary border-discord-background">
      <CardContent className="p-4">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-discord-text">
            {format(date, "EEEE, MMMM d, yyyy")}
          </h3>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {dailyEvents.length > 0 ? (
            dailyEvents.map((event) => (
              <div 
                key={event.id}
                className="p-3 rounded-md border border-discord-background hover:bg-discord-background cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={event.type === "pickup" ? 
                        "bg-blue-500 bg-opacity-20 text-blue-300" : 
                        "bg-green-500 bg-opacity-20 text-green-300"}>
                        {event.type === "pickup" ? "Pickup" : "Delivery"}
                      </Badge>
                      <Badge className={getStatusBadgeColor(event.status)}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-discord-text mb-1">
                      {event.title}
                    </h4>
                    <div className="flex items-center text-discord-muted text-sm">
                      <Truck className="h-4 w-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-discord-text">
                      {event.rate}
                    </div>
                    <div className="text-sm text-discord-muted">
                      Driver: {event.driver}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-discord-muted">
              <div className="flex flex-col items-center">
                <CalendarClock className="h-12 w-12 mb-4 text-discord-muted opacity-50" />
                <p className="mb-1">No loads scheduled for this day</p>
                <p className="text-sm">Try selecting a different date or adjusting your filters</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

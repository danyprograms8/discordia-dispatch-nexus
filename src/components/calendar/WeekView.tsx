
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { CalendarEvent } from "./types";

type WeekViewProps = {
  weeklyEvents: CalendarEvent[];
  getStatusBadgeColor: (status: string) => string;
  setSelectedEvent: (event: CalendarEvent | null) => void;
};

export const WeekView = ({ weeklyEvents, getStatusBadgeColor, setSelectedEvent }: WeekViewProps) => {
  return (
    <Card className="bg-discord-secondary border-discord-background">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4 font-medium text-discord-muted mb-2 px-2">
          <div>Load #</div>
          <div>Date</div>
          <div>Rate</div>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {weeklyEvents.length > 0 ? (
            weeklyEvents.map((event) => (
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
                    {format(parseISO(event.date), "EEE, MMMM d")}
                    <div className="text-xs text-discord-muted">
                      {event.type === "pickup" ? "Pickup" : "Delivery"}
                    </div>
                  </div>
                  <div className="text-discord-text">{event.rate}</div>
                </div>
                <div className="mt-1 text-xs text-discord-muted grid grid-cols-3 gap-4">
                  <div className="col-span-2 flex items-center">
                    <User className="h-3 w-3 mr-1" /> 
                    {event.driver}
                  </div>
                  <div>
                    <Badge className={`text-xs py-0 h-5 ${getStatusBadgeColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-discord-muted">
              No loads found for the selected week
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

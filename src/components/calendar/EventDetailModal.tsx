
import { format } from "date-fns";
import { CalendarIcon, Truck, User, X, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent } from "./types";

type EventDetailModalProps = {
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  getEventTypeColor: (type: string, status: string) => string;
  getStatusBadgeColor: (status: string) => string;
};

export const EventDetailModal = ({
  selectedEvent,
  setSelectedEvent,
  getEventTypeColor,
  getStatusBadgeColor
}: EventDetailModalProps) => {
  if (!selectedEvent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
      <div className="bg-discord-secondary p-6 rounded-lg w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-discord-text">Load #{selectedEvent.loadNumber}</h3>
          <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge className={getEventTypeColor(selectedEvent.type, selectedEvent.status)}>
              {selectedEvent.type === "pickup" ? "Pickup" : "Delivery"}
            </Badge>
            <Badge variant="outline" className={getStatusBadgeColor(selectedEvent.status)}>
              {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1).replace("-", " ")}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-discord-text">
              <CalendarIcon className="h-4 w-4 mr-2 text-discord-muted" />
              {format(new Date(selectedEvent.date), "EEEE, MMMM d, yyyy")}
            </div>
            <div className="flex items-center text-discord-text">
              <Truck className="h-4 w-4 mr-2 text-discord-muted" />
              {selectedEvent.location}
            </div>
            <div className="flex items-center text-discord-text">
              <User className="h-4 w-4 mr-2 text-discord-muted" />
              Driver: {selectedEvent.driver}
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
                // window.location.href = `/loads/${selectedEvent.id}`;
                setSelectedEvent(null);
              }}
            >
              View Load
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


export type CalendarEvent = {
  id: string;
  loadNumber: string;
  title: string;
  date: string;
  type: "pickup" | "delivery";
  location: string;
  driver: string;
  status: "booked" | "assigned" | "in-transit" | "delivered" | "cancelled";
  rate: string;
};

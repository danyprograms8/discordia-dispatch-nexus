
import { useState } from "react";
import { format, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarFilters } from "./CalendarFilters";

type CalendarHeaderProps = {
  date: Date;
  view: "month" | "week" | "day";
  statusFilter: string;
  driverFilter: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  isFilterOpen: boolean;
  setDate: (date: Date) => void;
  setView: (view: "month" | "week" | "day") => void;
  setIsFilterOpen: (isOpen: boolean) => void;
  handlePrevious: () => void;
  handleNext: () => void;
};

export const CalendarHeader = ({
  date,
  view,
  statusFilter,
  driverFilter,
  dateRangeStart,
  dateRangeEnd,
  isFilterOpen,
  setDate,
  setView,
  setIsFilterOpen,
  handlePrevious,
  handleNext,
}: CalendarHeaderProps) => {
  return (
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
        <Select value={view} onValueChange={(value: "month" | "week" | "day") => setView(value)}>
          <SelectTrigger className="w-[120px] bg-discord-secondary border-discord-background">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent className="bg-discord-background border-discord-background">
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="day">Day</SelectItem>
          </SelectContent>
        </Select>

        <CalendarFilters 
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          statusFilter={statusFilter}
          driverFilter={driverFilter}
          dateRangeStart={dateRangeStart}
          dateRangeEnd={dateRangeEnd}
        />
      </div>
    </div>
  );
};

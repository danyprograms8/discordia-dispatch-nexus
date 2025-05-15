
import { FilterIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type CalendarFiltersProps = {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  statusFilter: string;
  driverFilter: string;
  dateRangeStart: string;
  dateRangeEnd: string;
};

export const CalendarFilters = ({
  isFilterOpen,
  setIsFilterOpen,
  statusFilter,
  driverFilter,
  dateRangeStart,
  dateRangeEnd
}: CalendarFiltersProps) => {
  const hasActiveFilters = statusFilter !== "all" || driverFilter !== "all" || (dateRangeStart && dateRangeEnd);
  const activeFilterCount = 
    (statusFilter !== "all" ? 1 : 0) + 
    (driverFilter !== "all" ? 1 : 0) + 
    ((dateRangeStart && dateRangeEnd) ? 1 : 0);

  return (
    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-discord-secondary border-discord-background flex items-center gap-1"
        >
          <FilterIcon className="h-4 w-4" />
          {hasActiveFilters ? (
            <span className="flex items-center">
              Filters 
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-discord-accent text-white">
                {activeFilterCount}
              </Badge>
            </span>
          ) : (
            "Filters"
          )}
        </Button>
      </PopoverTrigger>
    </Popover>
  );
};

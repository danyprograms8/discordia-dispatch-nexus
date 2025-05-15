
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

type FilterContentProps = {
  statusFilter: string;
  driverFilter: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  drivers: string[];
  setStatusFilter: (status: string) => void;
  setDriverFilter: (driver: string) => void;
  setDateRangeStart: (date: string) => void;
  setDateRangeEnd: (date: string) => void;
  handleReset: () => void;
  handleApplyFilters: () => void;
};

export const FilterContent = ({
  statusFilter,
  driverFilter,
  dateRangeStart,
  dateRangeEnd,
  drivers,
  setStatusFilter,
  setDriverFilter,
  setDateRangeStart,
  setDateRangeEnd,
  handleReset,
  handleApplyFilters,
}: FilterContentProps) => {
  const hasFilters = statusFilter !== "all" || driverFilter !== "all" || dateRangeStart || dateRangeEnd;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-discord-text">Filters</h4>
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="h-8 px-2 text-discord-muted hover:text-discord-text"
          >
            <X className="h-4 w-4 mr-1" /> Clear All
          </Button>
        )}
      </div>
      
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
            <SelectItem value="cancelled">Cancelled</SelectItem>
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
  );
};

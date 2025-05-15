
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Search, CalendarIcon, FilterIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Define types
interface LogisticsData {
  id: string;
  dispatcher: string;
  emptyMiles: number;
  revenueMiles: number;
  totalMiles: number;
  basicFreightRate: number;
  oRate: number;
  rate: number;
  diff: number;
  revPerMile: number;
  bRevPerMile: number;
  loadDate: string;
  driverType: string;
}

const LogisticsDashboard = () => {
  // State for filters and data
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [dispatcherFilter, setDispatcherFilter] = useState("all");
  const [driverTypeFilter, setDriverTypeFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LogisticsData[]>([]);

  // Items per page
  const ITEMS_PER_PAGE = 10;

  // Fetch mock data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData: LogisticsData[] = [
        {
          id: "1",
          dispatcher: "John Smith",
          emptyMiles: 250,
          revenueMiles: 1250,
          totalMiles: 1500,
          basicFreightRate: 1200.00,
          oRate: 120.00,
          rate: 1320.00,
          diff: 0,
          revPerMile: 1.06,
          bRevPerMile: 0.96,
          loadDate: "2025-05-14",
          driverType: "Company"
        },
        {
          id: "2",
          dispatcher: "Maria Garcia",
          emptyMiles: 150,
          revenueMiles: 950,
          totalMiles: 1100,
          basicFreightRate: 980.00,
          oRate: 90.00,
          rate: 1070.00,
          diff: 20,
          revPerMile: 0.97,
          bRevPerMile: 0.89,
          loadDate: "2025-05-15",
          driverType: "Owner"
        },
        {
          id: "3",
          dispatcher: "Robert Johnson",
          emptyMiles: 180,
          revenueMiles: 1450,
          totalMiles: 1630,
          basicFreightRate: 1550.00,
          oRate: 150.00,
          rate: 1700.00,
          diff: -30,
          revPerMile: 1.04,
          bRevPerMile: 0.95,
          loadDate: "2025-05-16",
          driverType: "Company"
        },
        {
          id: "4",
          dispatcher: "Sarah Williams",
          emptyMiles: 200,
          revenueMiles: 1900,
          totalMiles: 2100,
          basicFreightRate: 2100.00,
          oRate: 210.00,
          rate: 2310.00,
          diff: 50,
          revPerMile: 1.10,
          bRevPerMile: 1.00,
          loadDate: "2025-05-18",
          driverType: "Owner"
        },
        {
          id: "5",
          dispatcher: "Michael Brown",
          emptyMiles: 300,
          revenueMiles: 1600,
          totalMiles: 1900,
          basicFreightRate: 1750.00,
          oRate: 175.00,
          rate: 1925.00,
          diff: -40,
          revPerMile: 1.01,
          bRevPerMile: 0.92,
          loadDate: "2025-05-19",
          driverType: "Company"
        },
        {
          id: "6",
          dispatcher: "John Smith",
          emptyMiles: 220,
          revenueMiles: 1300,
          totalMiles: 1520,
          basicFreightRate: 1350.00,
          oRate: 135.00,
          rate: 1485.00,
          diff: 10,
          revPerMile: 0.98,
          bRevPerMile: 0.89,
          loadDate: "2025-05-20",
          driverType: "Owner"
        },
        {
          id: "7",
          dispatcher: "Maria Garcia",
          emptyMiles: 190,
          revenueMiles: 1400,
          totalMiles: 1590,
          basicFreightRate: 1480.00,
          oRate: 148.00,
          rate: 1628.00,
          diff: 0,
          revPerMile: 1.02,
          bRevPerMile: 0.93,
          loadDate: "2025-05-21",
          driverType: "Company"
        },
        {
          id: "8",
          dispatcher: "Sarah Williams",
          emptyMiles: 280,
          revenueMiles: 1550,
          totalMiles: 1830,
          basicFreightRate: 1650.00,
          oRate: 165.00,
          rate: 1815.00,
          diff: 25,
          revPerMile: 0.99,
          bRevPerMile: 0.90,
          loadDate: "2025-05-22",
          driverType: "Owner"
        },
        {
          id: "9",
          dispatcher: "Robert Johnson",
          emptyMiles: 230,
          revenueMiles: 1350,
          totalMiles: 1580,
          basicFreightRate: 1420.00,
          oRate: 142.00,
          rate: 1562.00,
          diff: -15,
          revPerMile: 0.99,
          bRevPerMile: 0.90,
          loadDate: "2025-05-23",
          driverType: "Company"
        },
        {
          id: "10",
          dispatcher: "Michael Brown",
          emptyMiles: 210,
          revenueMiles: 1250,
          totalMiles: 1460,
          basicFreightRate: 1300.00,
          oRate: 130.00,
          rate: 1430.00,
          diff: 35,
          revPerMile: 0.98,
          bRevPerMile: 0.89,
          loadDate: "2025-05-24",
          driverType: "Owner"
        },
        {
          id: "11",
          dispatcher: "John Smith",
          emptyMiles: 320,
          revenueMiles: 1750,
          totalMiles: 2070,
          basicFreightRate: 1900.00,
          oRate: 190.00,
          rate: 2090.00,
          diff: -20,
          revPerMile: 1.01,
          bRevPerMile: 0.92,
          loadDate: "2025-05-25",
          driverType: "Company"
        },
        {
          id: "12",
          dispatcher: "Maria Garcia",
          emptyMiles: 270,
          revenueMiles: 1500,
          totalMiles: 1770,
          basicFreightRate: 1580.00,
          oRate: 158.00,
          rate: 1738.00,
          diff: 40,
          revPerMile: 0.98,
          bRevPerMile: 0.89,
          loadDate: "2025-05-26",
          driverType: "Owner"
        },
      ];
      
      setData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  // Extract unique dispatchers and driver types for filters
  const dispatchers = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.dispatcher)));
  }, [data]);

  const driverTypes = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.driverType)));
  }, [data]);

  // Apply filters and search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Date range filter
      let matchesDateRange = true;
      if (fromDate && toDate) {
        const itemDate = new Date(item.loadDate);
        const start = new Date(fromDate);
        const end = new Date(toDate);
        
        // Set hours to 0 for proper comparison
        itemDate.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        
        matchesDateRange = itemDate >= start && itemDate <= end;
      }
      
      // Dispatcher filter
      const matchesDispatcher = dispatcherFilter === "all" || item.dispatcher === dispatcherFilter;
      
      // Driver type filter
      const matchesDriverType = driverTypeFilter === "all" || item.driverType === driverTypeFilter;
      
      // Search query (searches dispatcher name)
      const matchesSearch = item.dispatcher.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDateRange && matchesDispatcher && matchesDriverType && matchesSearch;
    });
  }, [data, fromDate, toDate, dispatcherFilter, driverTypeFilter, searchQuery]);

  // Calculate totals for footer
  const totals = useMemo(() => {
    const initialTotals = {
      emptyMiles: 0,
      revenueMiles: 0,
      totalMiles: 0,
      basicFreightRate: 0,
      oRate: 0,
      rate: 0,
      diff: 0,
    };
    
    return filteredData.reduce((acc, item) => {
      return {
        emptyMiles: acc.emptyMiles + item.emptyMiles,
        revenueMiles: acc.revenueMiles + item.revenueMiles,
        totalMiles: acc.totalMiles + item.totalMiles,
        basicFreightRate: acc.basicFreightRate + item.basicFreightRate,
        oRate: acc.oRate + item.oRate,
        rate: acc.rate + item.rate,
        diff: acc.diff + item.diff,
      };
    }, initialTotals);
  }, [filteredData]);
  
  // Calculate average Rev Per Mile and BRevPerMile
  const averages = useMemo(() => {
    if (totals.totalMiles === 0) return { revPerMile: 0, bRevPerMile: 0 };
    
    return {
      revPerMile: Number((totals.rate / totals.totalMiles).toFixed(2)),
      bRevPerMile: Number((totals.basicFreightRate / totals.totalMiles).toFixed(2)),
    };
  }, [totals]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Handle reset filters
  const handleReset = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setDispatcherFilter("all");
    setDriverTypeFilter("all");
    setIsFilterOpen(false);
    setSearchQuery("");
    
    toast({
      title: "Filters reset",
      description: "All filters have been cleared"
    });
  };

  // Handle generate report
  const handleGenerateReport = () => {
    toast({
      title: "Generating report",
      description: `Report generated with ${filteredData.length} entries`
    });
    
    // In a real application, this would trigger an API call or download
    console.log("Generate report with filters:", {
      fromDate,
      toDate,
      dispatcherFilter,
      driverTypeFilter,
      results: filteredData.length
    });
  };

  // Handle dispatcher click
  const handleDispatcherClick = (dispatcher: string) => {
    setDispatcherFilter(dispatcher);
    
    toast({
      title: "Dispatcher selected",
      description: `Filtered to show ${dispatcher}'s entries`
    });
  };

  // Apply filters
  const handleApplyFilters = () => {
    // Validate date range
    if (fromDate && toDate) {
      if (fromDate > toDate) {
        toast({
          title: "Invalid date range",
          description: "Start date must be before end date"
        });
        return;
      }
    }
    
    setIsFilterOpen(false);
    
    toast({
      title: "Filters applied",
      description: "Dashboard view has been updated"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-discord-text">Logistics Dashboard</h1>
        <p className="text-discord-muted">Track driver performance metrics and revenue data</p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-discord-secondary border-discord-background flex items-center gap-1"
                >
                  <FilterIcon className="h-4 w-4" />
                  {(dispatcherFilter !== "all" || driverTypeFilter !== "all" || (fromDate && toDate)) ? (
                    <span className="flex items-center">
                      Filters 
                      <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-discord-accent text-white">
                        {(dispatcherFilter !== "all" ? 1 : 0) + 
                        (driverTypeFilter !== "all" ? 1 : 0) + 
                        ((fromDate && toDate) ? 1 : 0)}
                      </Badge>
                    </span>
                  ) : (
                    "Filters"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 bg-white border-gray-200 shadow-lg">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Filter Options</h3>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Load Date Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500">From</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal border-gray-300 bg-white text-gray-700"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {fromDate ? format(fromDate, "MMM dd, yyyy") : <span>Pick date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={fromDate}
                              onSelect={setFromDate}
                              initialFocus
                              className="p-3 pointer-events-auto bg-white"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500">To</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal border-gray-300 bg-white text-gray-700"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {toDate ? format(toDate, "MMM dd, yyyy") : <span>Pick date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={toDate}
                              onSelect={setToDate}
                              initialFocus
                              className="p-3 pointer-events-auto bg-white"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Dispatcher</h4>
                    <Select value={dispatcherFilter} onValueChange={setDispatcherFilter}>
                      <SelectTrigger className="w-full bg-white border-gray-300 text-gray-700">
                        <SelectValue placeholder="All Dispatchers" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="all">All Dispatchers</SelectItem>
                        {dispatchers.map((dispatcher) => (
                          <SelectItem key={dispatcher} value={dispatcher}>{dispatcher}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Driver Type</h4>
                    <Select value={driverTypeFilter} onValueChange={setDriverTypeFilter}>
                      <SelectTrigger className="w-full bg-white border-gray-300 text-gray-700">
                        <SelectValue placeholder="All Driver Types" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="all">All Driver Types</SelectItem>
                        {driverTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    >
                      Reset
                    </Button>
                    <Button onClick={handleApplyFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="hidden sm:flex sm:items-center">
              {dispatcherFilter !== "all" && (
                <Badge 
                  variant="outline" 
                  className="bg-white text-gray-700 border-gray-300 flex items-center gap-1 px-3"
                >
                  Dispatcher: {dispatcherFilter}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-discord-error" 
                    onClick={() => setDispatcherFilter("all")}
                  />
                </Badge>
              )}
              
              {driverTypeFilter !== "all" && (
                <Badge 
                  variant="outline" 
                  className="bg-white text-gray-700 border-gray-300 flex items-center gap-1 px-3 ml-2"
                >
                  Type: {driverTypeFilter}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-discord-error" 
                    onClick={() => setDriverTypeFilter("all")}
                  />
                </Badge>
              )}
              
              {fromDate && toDate && (
                <Badge 
                  variant="outline" 
                  className="bg-white text-gray-700 border-gray-300 flex items-center gap-1 px-3 ml-2"
                >
                  {format(fromDate, "MM/dd/yyyy")} - {format(toDate, "MM/dd/yyyy")}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-discord-error" 
                    onClick={() => {
                      setFromDate(undefined);
                      setToDate(undefined);
                    }}
                  />
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-grow sm:max-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search dispatchers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-white border-gray-300 text-gray-700"
            />
          </div>
          <Button 
            onClick={handleGenerateReport}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            GETREPORT
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-md border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-700">Dispatcher</TableHead>
              <TableHead className="text-gray-700 text-right">Empty Miles</TableHead>
              <TableHead className="text-gray-700 text-right">Revenue Miles</TableHead>
              <TableHead className="text-gray-700 text-right">Total Miles</TableHead>
              <TableHead className="text-gray-700 text-right">Basic Freight Rate</TableHead>
              <TableHead className="text-gray-700 text-right">ORate</TableHead>
              <TableHead className="text-gray-700 text-right">Rate</TableHead>
              <TableHead className="text-gray-700 text-right">Diff</TableHead>
              <TableHead className="text-gray-700 text-right">Rev Per Mile</TableHead>
              <TableHead className="text-gray-700 text-right">BRevPerMile</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-discord-accent border-t-transparent rounded-full" />
                  </div>
                  <div className="mt-2 text-gray-500">Loading data...</div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No data found for the selected filters
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <button
                      onClick={() => handleDispatcherClick(item.dispatcher)}
                      className="text-blue-600 hover:underline font-medium text-left"
                    >
                      {item.dispatcher}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">{item.emptyMiles.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.revenueMiles.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.totalMiles.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${item.basicFreightRate.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.oRate.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={
                      item.diff > 0 
                        ? "text-green-600" 
                        : item.diff < 0 
                        ? "text-red-600" 
                        : ""
                    }>
                      {item.diff > 0 ? "+" : ""}{item.diff}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">${item.revPerMile.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.bRevPerMile.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter className="bg-gray-50 font-semibold">
            <TableRow>
              <TableCell>TOTALS</TableCell>
              <TableCell className="text-right">{totals.emptyMiles.toLocaleString()}</TableCell>
              <TableCell className="text-right">{totals.revenueMiles.toLocaleString()}</TableCell>
              <TableCell className="text-right">{totals.totalMiles.toLocaleString()}</TableCell>
              <TableCell className="text-right">${totals.basicFreightRate.toFixed(2)}</TableCell>
              <TableCell className="text-right">${totals.oRate.toFixed(2)}</TableCell>
              <TableCell className="text-right">${totals.rate.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <span className={
                  totals.diff > 0 
                    ? "text-green-600" 
                    : totals.diff < 0 
                    ? "text-red-600" 
                    : ""
                }>
                  {totals.diff > 0 ? "+" : ""}{totals.diff}
                </span>
              </TableCell>
              <TableCell className="text-right">${averages.revPerMile.toFixed(2)}</TableCell>
              <TableCell className="text-right">${averages.bRevPerMile.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Pagination Controls */}
      {filteredData.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Simple pagination logic to show current page and nearby pages
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                }
                if (currentPage > totalPages - 2) {
                  pageNum = totalPages - 5 + i + 1;
                }
              }
              
              if (pageNum <= totalPages) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default LogisticsDashboard;

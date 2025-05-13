
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  CalendarDays, 
  PlusCircle,
  Calendar as CalendarIcon,
  Thermometer,
  MapPin,
  Clock
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Types
type Load = {
  id: string;
  broker_name: string;
  broker_load_number: string;
  load_type: string;
  temperature: string | null;
  rate: number;
  status: "booked" | "assigned" | "in-transit" | "delivered" | "cancelled";
  driver_name: string | null;
  pickup_city: string;
  pickup_state: string;
  pickup_date: string;
  delivery_city: string;
  delivery_state: string;
  delivery_date: string;
};

const LoadsList = () => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "rate" | "status">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch loads
  useEffect(() => {
    const fetchLoads = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch this data from Supabase
        // For now, we'll use mock data
        const mockLoads: Load[] = [
          {
            id: "1",
            broker_name: "ABC Logistics",
            broker_load_number: "BL1234",
            load_type: "Dry Van",
            temperature: null,
            rate: 2500,
            status: "booked",
            driver_name: null,
            pickup_city: "Dallas",
            pickup_state: "TX",
            pickup_date: "2025-05-14",
            delivery_city: "Houston",
            delivery_state: "TX",
            delivery_date: "2025-05-15",
          },
          {
            id: "2",
            broker_name: "XYZ Transport",
            broker_load_number: "XYZ5678",
            load_type: "Reefer",
            temperature: "34°F",
            rate: 3200,
            status: "assigned",
            driver_name: "John Doe",
            pickup_city: "Chicago",
            pickup_state: "IL",
            pickup_date: "2025-05-15",
            delivery_city: "Detroit",
            delivery_state: "MI",
            delivery_date: "2025-05-16",
          },
          {
            id: "3",
            broker_name: "FastFreight",
            broker_load_number: "FF9012",
            load_type: "Flatbed",
            temperature: null,
            rate: 2800,
            status: "in-transit",
            driver_name: "Mike Johnson",
            pickup_city: "Atlanta",
            pickup_state: "GA",
            pickup_date: "2025-05-13",
            delivery_city: "Miami",
            delivery_state: "FL",
            delivery_date: "2025-05-17",
          },
          {
            id: "4",
            broker_name: "GHI Shipping",
            broker_load_number: "GH3456",
            load_type: "Reefer",
            temperature: "28°F",
            rate: 3800,
            status: "delivered",
            driver_name: "Sarah Williams",
            pickup_city: "Los Angeles",
            pickup_state: "CA",
            pickup_date: "2025-05-10",
            delivery_city: "Phoenix",
            delivery_state: "AZ",
            delivery_date: "2025-05-12",
          },
          {
            id: "5",
            broker_name: "JKL Freight",
            broker_load_number: "JK7890",
            load_type: "Dry Van",
            temperature: null,
            rate: 2100,
            status: "cancelled",
            driver_name: null,
            pickup_city: "Seattle",
            pickup_state: "WA",
            pickup_date: "2025-05-18",
            delivery_city: "Portland",
            delivery_state: "OR",
            delivery_date: "2025-05-19",
          },
        ];
        
        setLoads(mockLoads);
      } catch (err) {
        console.error("Error fetching loads:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoads();
  }, []);

  // Filter and sort loads when any of these dependencies change
  useEffect(() => {
    let result = [...loads];
    
    // Filter by status tab
    if (activeTab !== "all") {
      result = result.filter(load => load.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(load => 
        load.broker_name.toLowerCase().includes(lowercasedSearch) ||
        load.broker_load_number.toLowerCase().includes(lowercasedSearch) ||
        load.pickup_city.toLowerCase().includes(lowercasedSearch) ||
        load.delivery_city.toLowerCase().includes(lowercasedSearch) ||
        (load.driver_name && load.driver_name.toLowerCase().includes(lowercasedSearch))
      );
    }
    
    // Sort the results
    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortDirection === "asc"
          ? new Date(a.pickup_date).getTime() - new Date(b.pickup_date).getTime()
          : new Date(b.pickup_date).getTime() - new Date(a.pickup_date).getTime();
      } else if (sortBy === "rate") {
        return sortDirection === "asc" ? a.rate - b.rate : b.rate - a.rate;
      } else {
        // Status sorting logic
        const statusOrder = {
          booked: 1,
          assigned: 2,
          "in-transit": 3,
          delivered: 4,
          cancelled: 5,
        };
        return sortDirection === "asc"
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      }
    });
    
    setFilteredLoads(result);
  }, [loads, activeTab, searchTerm, sortBy, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "booked": return "status-booked";
      case "assigned": return "status-assigned";
      case "in-transit": return "status-in-transit";
      case "delivered": return "status-delivered";
      case "cancelled": return "status-cancelled";
      default: return "";
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-170px)] md:h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-discord-accent rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-discord-muted">Loading loads...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-170px)] md:h-[calc(100vh-100px)]">
        <Card className="w-full max-w-md bg-discord-secondary border-discord-background">
          <CardContent className="pt-6">
            <p className="text-discord-error mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-discord-accent hover:bg-discord-accent/80 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-discord-text">Loads</h1>
          <p className="text-discord-muted">Manage and track all your shipments</p>
        </div>
        <Link to="/loads/new">
          <Button className="bg-discord-accent hover:bg-discord-accent/80 text-white flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Load
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-discord-muted" />
          <Input
            placeholder="Search loads..."
            className="pl-10 bg-discord-secondary border-discord-background text-discord-text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="border-discord-background bg-discord-secondary text-discord-text flex items-center"
              >
                <Filter className="mr-2 h-4 w-4" /> 
                Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} {' '}
                {sortDirection === "asc" ? "↑" : "↓"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-discord-secondary border-discord-background">
              <DropdownMenuItem 
                className="text-discord-text hover:bg-discord-background hover:text-discord-accent cursor-pointer"
                onClick={() => { setSortBy("date"); toggleSortDirection(); }}
              >
                Date {sortBy === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-discord-text hover:bg-discord-background hover:text-discord-accent cursor-pointer"
                onClick={() => { setSortBy("rate"); toggleSortDirection(); }}
              >
                Rate {sortBy === "rate" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-discord-text hover:bg-discord-background hover:text-discord-accent cursor-pointer"
                onClick={() => { setSortBy("status"); toggleSortDirection(); }}
              >
                Status {sortBy === "status" && (sortDirection === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            className="border-discord-background bg-discord-secondary text-discord-text flex items-center"
          >
            <CalendarDays className="mr-2 h-4 w-4" /> Date
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-discord-secondary mb-6 w-full sm:w-auto">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-discord-accent data-[state=active]:text-white text-discord-muted"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="booked" 
            className="data-[state=active]:bg-discord-accent data-[state=active]:text-white text-discord-muted"
          >
            Booked
          </TabsTrigger>
          <TabsTrigger 
            value="assigned" 
            className="data-[state=active]:bg-discord-accent data-[state=active]:text-white text-discord-muted"
          >
            Assigned
          </TabsTrigger>
          <TabsTrigger 
            value="in-transit" 
            className="data-[state=active]:bg-discord-accent data-[state=active]:text-white text-discord-muted"
          >
            In Transit
          </TabsTrigger>
          <TabsTrigger 
            value="delivered" 
            className="data-[state=active]:bg-discord-accent data-[state=active]:text-white text-discord-muted"
          >
            Delivered
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredLoads.length === 0 ? (
            <Card className="bg-discord-secondary border-discord-background">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <p className="text-discord-muted mb-4">No loads found</p>
                <Link to="/loads/new">
                  <Button className="bg-discord-accent hover:bg-discord-accent/80 text-white flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Load
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredLoads.map((load) => (
                <Link to={`/loads/${load.id}`} key={load.id}>
                  <Card className="bg-discord-secondary border-discord-background hover:bg-discord-secondary/80 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <div className="font-semibold text-discord-text mr-2 truncate">
                              {load.broker_name} - #{load.broker_load_number}
                            </div>
                            <div className={`status-pill ${getStatusClass(load.status)}`}>
                              {load.status.charAt(0).toUpperCase() + load.status.slice(1).replace("-", " ")}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center text-discord-muted">
                              <MapPin className="mr-1 h-4 w-4" />
                              {load.pickup_city}, {load.pickup_state} → {load.delivery_city}, {load.delivery_state}
                            </div>
                            
                            {load.temperature && (
                              <div className="flex items-center text-discord-muted">
                                <Thermometer className="mr-1 h-4 w-4" />
                                {load.temperature}
                              </div>
                            )}
                            
                            <div className="flex items-center text-discord-muted">
                              <Clock className="mr-1 h-4 w-4" />
                              {formatDate(load.pickup_date)}
                            </div>
                            
                            <div className="flex items-center font-medium text-discord-text">
                              ${load.rate.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4 md:mt-0">
                          {load.driver_name ? (
                            <div className="text-sm text-discord-muted">
                              Driver: <span className="text-discord-text">{load.driver_name}</span>
                            </div>
                          ) : (
                            <div className="text-sm italic text-discord-muted">
                              No driver assigned
                            </div>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4 text-discord-muted" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoadsList;

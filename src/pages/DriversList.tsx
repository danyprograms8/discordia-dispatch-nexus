
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  PlusCircle,
  Phone,
  User,
  MapPin,
  CalendarDays,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from '@supabase/supabase-js';

// Define Supabase credentials directly
const supabaseUrl = "https://cfzlbsnnrveqbyyupupi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmemxic25ucnZlcWJ5eXVwdXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzE1MzU2MiwiZXhwIjoyMDYyNzI5NTYyfQ.41kCJhWCCnmREmlqxcmRmL-u0oULessR_20XBpO7B-4";

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Types
type Driver = {
  id: string;
  name: string;
  phone: string;
  email: string;
  license_number: string;
  license_state: string;
  truck_number: string;
  status: "available" | "on-load" | "off-duty";
  current_location_city: string;
  current_location_state: string;
  available_date: string | null;
  available_time: string | null;
  current_load?: {
    id: string;
    broker_name: string;
    broker_load_number: string;
    pickup_city: string;
    pickup_state: string;
    delivery_city: string;
    delivery_state: string;
  } | null;
};

const DriversList = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "on-load" | "off-duty">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch this data from Supabase
        // For now, we'll use mock data
        const mockDrivers: Driver[] = [
          {
            id: "1",
            name: "John Doe",
            phone: "555-123-4567",
            email: "john.doe@example.com",
            license_number: "DL123456",
            license_state: "TX",
            truck_number: "T-101",
            status: "available",
            current_location_city: "Dallas",
            current_location_state: "TX",
            available_date: "2025-05-14",
            available_time: "08:00:00",
            current_load: null,
          },
          {
            id: "2",
            name: "Mike Johnson",
            phone: "555-987-6543",
            email: "mike.johnson@example.com",
            license_number: "DL789012",
            license_state: "CA",
            truck_number: "T-202",
            status: "on-load",
            current_location_city: "Los Angeles",
            current_location_state: "CA",
            available_date: null,
            available_time: null,
            current_load: {
              id: "l1",
              broker_name: "ABC Logistics",
              broker_load_number: "BL1234",
              pickup_city: "Los Angeles",
              pickup_state: "CA",
              delivery_city: "Phoenix",
              delivery_state: "AZ",
            },
          },
          {
            id: "3",
            name: "Sarah Williams",
            phone: "555-246-8024",
            email: "sarah.williams@example.com",
            license_number: "DL345678",
            license_state: "FL",
            truck_number: "T-303",
            status: "off-duty",
            current_location_city: "Miami",
            current_location_state: "FL",
            available_date: "2025-05-17",
            available_time: "09:00:00",
            current_load: null,
          },
          {
            id: "4",
            name: "David Brown",
            phone: "555-369-1478",
            email: "david.brown@example.com",
            license_number: "DL901234",
            license_state: "NY",
            truck_number: "T-404",
            status: "available",
            current_location_city: "New York",
            current_location_state: "NY",
            available_date: "2025-05-13",
            available_time: "10:00:00",
            current_load: null,
          },
          {
            id: "5",
            name: "Emily Davis",
            phone: "555-258-3690",
            email: "emily.davis@example.com",
            license_number: "DL567890",
            license_state: "IL",
            truck_number: "T-505",
            status: "on-load",
            current_location_city: "Chicago",
            current_location_state: "IL",
            available_date: null,
            available_time: null,
            current_load: {
              id: "l2",
              broker_name: "XYZ Transport",
              broker_load_number: "XYZ5678",
              pickup_city: "Chicago",
              pickup_state: "IL",
              delivery_city: "Detroit",
              delivery_state: "MI",
            },
          },
        ];
        
        setDrivers(mockDrivers);
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Filter drivers when any of these dependencies change
  useEffect(() => {
    let result = [...drivers];
    
    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(driver => driver.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(driver => 
        driver.name.toLowerCase().includes(lowercasedSearch) ||
        driver.truck_number.toLowerCase().includes(lowercasedSearch) ||
        driver.current_location_city.toLowerCase().includes(lowercasedSearch) ||
        driver.current_location_state.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    setFilteredDrivers(result);
  }, [drivers, statusFilter, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-discord-success bg-opacity-20 text-discord-success";
      case "on-load": return "bg-blue-500 bg-opacity-20 text-blue-300";
      case "off-duty": return "bg-discord-muted bg-opacity-20 text-discord-muted";
      default: return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": 
        return <CheckCircle className="h-4 w-4 text-discord-success" />;
      case "on-load": 
        return <Truck className="h-4 w-4 text-blue-300" />;
      case "off-duty": 
        return <Clock className="h-4 w-4 text-discord-muted" />;
      default: 
        return null;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "";
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${suffix}`;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-170px)] md:h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-discord-accent rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-discord-muted">Loading drivers...</p>
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
          <h1 className="text-2xl font-bold text-discord-text">Drivers</h1>
          <p className="text-discord-muted">Manage your driver fleet</p>
        </div>
        <Link to="/drivers/new">
          <Button className="bg-discord-accent hover:bg-discord-accent/80 text-white flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Driver
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-discord-muted" />
          <Input
            placeholder="Search drivers..."
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
                Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1).replace("-", " ")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-discord-secondary border-discord-background">
              <DropdownMenuItem 
                className="text-discord-text hover:bg-discord-background hover:text-discord-accent cursor-pointer"
                onClick={() => setStatusFilter("all")}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-discord-success hover:bg-discord-background hover:text-discord-accent cursor-pointer"
                onClick={() => setStatusFilter("available")}
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Available
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-blue-300 hover:bg-discord-background hover:text-discord-accent cursor-pointer"
                onClick={() => setStatusFilter("on-load")}
              >
                <Truck className="h-4 w-4 mr-2" /> On Load
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-discord-muted hover:bg-discord-background hover:text-discord-accent cursor-pointer"
                onClick={() => setStatusFilter("off-duty")}
              >
                <Clock className="h-4 w-4 mr-2" /> Off Duty
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Driver Cards */}
      {filteredDrivers.length === 0 ? (
        <Card className="bg-discord-secondary border-discord-background">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="text-discord-muted mb-4">No drivers found</p>
            <Link to="/drivers/new">
              <Button className="bg-discord-accent hover:bg-discord-accent/80 text-white flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Driver
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <Link to={`/drivers/${driver.id}`} key={driver.id}>
              <Card className="bg-discord-secondary border-discord-background hover:bg-discord-secondary/80 transition-colors h-full">
                <CardContent className="p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-discord-accent flex items-center justify-center text-white text-xl font-bold mr-3">
                      {driver.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="text-discord-text font-semibold truncate">{driver.name}</h3>
                        <Badge variant="outline" className={`ml-2 ${getStatusColor(driver.status)}`}>
                          <span className="flex items-center">
                            {getStatusIcon(driver.status)}
                            <span className="ml-1">
                              {driver.status === "on-load" ? "On Load" : 
                                driver.status === "off-duty" ? "Off Duty" : "Available"}
                            </span>
                          </span>
                        </Badge>
                      </div>
                      <p className="text-discord-muted text-sm">Truck #{driver.truck_number}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-discord-muted">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{driver.current_location_city}, {driver.current_location_state}</span>
                    </div>
                    
                    {driver.status === "available" && (
                      <div className="flex items-center text-discord-muted">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Available: {formatDate(driver.available_date)}{' '}
                          {driver.available_time && formatTime(driver.available_time)}
                        </span>
                      </div>
                    )}
                    
                    {driver.status === "on-load" && driver.current_load && (
                      <div className="space-y-1">
                        <div className="text-sm text-discord-muted flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          <span>{driver.current_load.broker_name} - #{driver.current_load.broker_load_number}</span>
                        </div>
                        <div className="text-sm text-discord-muted pl-6">
                          {driver.current_load.pickup_city}, {driver.current_load.pickup_state} → {' '}
                          {driver.current_load.delivery_city}, {driver.current_load.delivery_state}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-discord-muted hover:text-discord-text border-discord-background bg-discord-background"
                      onClick={(e) => {
                        e.preventDefault();
                        // Would handle call action in a real app
                      }}
                    >
                      <Phone className="mr-1 w-3 h-3" /> Call
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-discord-accent hover:bg-discord-accent/10 border-discord-accent"
                    >
                      <User className="mr-1 w-3 h-3" /> View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriversList;

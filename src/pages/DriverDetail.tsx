import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Truck,
  MapPin,
  FileText,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  ClipboardEdit,
  PlusCircle,
  History,
  BarChart,
  Loader2,
  FileCheck,
  MessageSquarePlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with explicit values
const supabaseUrl = "https://cfzlbsnnrveqbyyupupi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmemxic25ucnZlcWJ5eXVwdXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzE1MzU2MiwiZXhwIjoyMDYyNzI5NTYyfQ.41kCJhWCCnmREmlqxcmRmL-u0oULessR_20XBpO7B-4";
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
};

type Load = {
  id: string;
  broker_name: string;
  broker_load_number: string;
  pickup_city: string;
  pickup_state: string;
  delivery_city: string;
  delivery_state: string;
  pickup_date: string;
  delivery_date: string;
  rate: number;
  status: "booked" | "assigned" | "in-transit" | "delivered" | "cancelled";
};

type Note = {
  id: string;
  driver_id: string;
  user_id: string;
  user_name: string;
  note_text: string;
  note_type: "general" | "performance" | "maintenance" | "issue";
  created_at: string;
};

type Document = {
  id: string;
  name: string;
  type: "license" | "medical" | "insurance" | "other";
  upload_date: string;
  expiry_date: string | null;
};

type PerformanceMetric = {
  month: string;
  on_time_delivery_rate: number;
  loads_completed: number;
  average_miles_per_day: number;
};

const DriverDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [currentLoad, setCurrentLoad] = useState<Load | null>(null);
  const [loadHistory, setLoadHistory] = useState<Load[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"general" | "performance" | "maintenance" | "issue">("general");
  const [activeTab, setActiveTab] = useState("loads");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"available" | "on-load" | "off-duty">("available");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch driver details
  useEffect(() => {
    const fetchDriverDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // In a real app, we would fetch this data from Supabase
        // For now, we'll use mock data
        const mockDriver: Driver = {
          id,
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
        };

        setDriver(mockDriver);
        setSelectedStatus(mockDriver.status);

        // Mock current load (null since the driver is available)
        setCurrentLoad(null);

        // Mock load history
        const mockLoadHistory: Load[] = [
          {
            id: "l1",
            broker_name: "ABC Logistics",
            broker_load_number: "BL1234",
            pickup_city: "Dallas",
            pickup_state: "TX",
            delivery_city: "Houston",
            delivery_state: "TX",
            pickup_date: "2025-05-05",
            delivery_date: "2025-05-06",
            rate: 2500,
            status: "delivered",
          },
          {
            id: "l2",
            broker_name: "XYZ Transport",
            broker_load_number: "XYZ5678",
            pickup_city: "Houston",
            pickup_state: "TX",
            delivery_city: "San Antonio",
            delivery_state: "TX",
            pickup_date: "2025-05-07",
            delivery_date: "2025-05-08",
            rate: 2200,
            status: "delivered",
          },
          {
            id: "l3",
            broker_name: "FastFreight",
            broker_load_number: "FF9012",
            pickup_city: "San Antonio",
            pickup_state: "TX",
            delivery_city: "Dallas",
            delivery_state: "TX",
            pickup_date: "2025-05-09",
            delivery_date: "2025-05-10",
            rate: 1800,
            status: "delivered",
          },
        ];

        setLoadHistory(mockLoadHistory);

        // Mock notes
        const mockNotes: Note[] = [
          {
            id: "n1",
            driver_id: id,
            user_id: "u1",
            user_name: "Admin User",
            note_text: "Driver completed safety training successfully",
            note_type: "general",
            created_at: "2025-05-01T10:30:00",
          },
          {
            id: "n2",
            driver_id: id,
            user_id: "u1",
            user_name: "Admin User",
            note_text: "Truck maintenance scheduled for next week",
            note_type: "maintenance",
            created_at: "2025-05-08T14:15:00",
          },
        ];

        setNotes(mockNotes);

        // Mock documents
        const mockDocuments: Document[] = [
          {
            id: "d1",
            name: "Driver's License",
            type: "license",
            upload_date: "2025-01-15",
            expiry_date: "2027-01-15",
          },
          {
            id: "d2",
            name: "Medical Certificate",
            type: "medical",
            upload_date: "2025-02-20",
            expiry_date: "2026-02-20",
          },
          {
            id: "d3",
            name: "Insurance Policy",
            type: "insurance",
            upload_date: "2025-01-05",
            expiry_date: "2026-01-05",
          },
        ];

        setDocuments(mockDocuments);

        // Mock performance metrics
        const mockPerformanceMetrics: PerformanceMetric[] = [
          {
            month: "Jan",
            on_time_delivery_rate: 95,
            loads_completed: 18,
            average_miles_per_day: 320,
          },
          {
            month: "Feb",
            on_time_delivery_rate: 98,
            loads_completed: 20,
            average_miles_per_day: 340,
          },
          {
            month: "Mar",
            on_time_delivery_rate: 92,
            loads_completed: 16,
            average_miles_per_day: 290,
          },
          {
            month: "Apr",
            on_time_delivery_rate: 97,
            loads_completed: 22,
            average_miles_per_day: 350,
          },
          {
            month: "May",
            on_time_delivery_rate: 96,
            loads_completed: 14,
            average_miles_per_day: 330,
          },
        ];

        setPerformanceMetrics(mockPerformanceMetrics);
      } catch (err) {
        console.error("Error fetching driver details:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, [id]);

  const handleStatusChange = (newStatus: "available" | "on-load" | "off-duty") => {
    setSelectedStatus(newStatus);
  };

  const saveStatusChange = () => {
    if (!driver) return;

    // In a real app, we would update this in Supabase
    setDriver({ ...driver, status: selectedStatus });
    setIsStatusDialogOpen(false);

    toast({
      title: "Status Updated",
      description: `Driver status changed to ${selectedStatus.replace("-", " ")}`,
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !driver) return;

    const newNoteItem: Note = {
      id: `n${Date.now()}`,
      driver_id: driver.id,
      user_id: "current-user-id", // In a real app, get from auth context
      user_name: "Current User", // In a real app, get from auth context
      note_text: newNote.trim(),
      note_type: noteType,
      created_at: new Date().toISOString(),
    };

    // In a real app, we would save this to Supabase
    setNotes([newNoteItem, ...notes]);
    setNewNote("");
    
    toast({
      title: "Note Added",
      description: "Your note has been added to this driver",
    });
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

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-discord-success bg-opacity-20 text-discord-success";
      case "on-load": return "bg-blue-500 bg-opacity-20 text-blue-300";
      case "off-duty": return "bg-discord-muted bg-opacity-20 text-discord-muted";
      case "booked": return "bg-blue-500 bg-opacity-20 text-blue-300";
      case "assigned": return "bg-purple-500 bg-opacity-20 text-purple-300";
      case "in-transit": return "bg-yellow-500 bg-opacity-20 text-yellow-300";
      case "delivered": return "bg-discord-success bg-opacity-20 text-discord-success";
      case "cancelled": return "bg-discord-error bg-opacity-20 text-discord-error";
      default: return "";
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case "performance":
        return "bg-blue-500 bg-opacity-20 text-blue-300";
      case "maintenance":
        return "bg-purple-500 bg-opacity-20 text-purple-300";
      case "issue":
        return "bg-discord-error bg-opacity-20 text-discord-error";
      default: // general
        return "bg-green-500 bg-opacity-20 text-green-300";
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "license": return <FileCheck className="h-4 w-4 text-blue-300" />;
      case "medical": return <FileCheck className="h-4 w-4 text-green-300" />;
      case "insurance": return <FileCheck className="h-4 w-4 text-purple-300" />;
      default: return <FileText className="h-4 w-4 text-discord-muted" />;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-170px)] md:h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-discord-accent rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-discord-muted">Loading driver details...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !driver) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-170px)] md:h-[calc(100vh-100px)]">
        <Card className="w-full max-w-md bg-discord-secondary border-discord-background">
          <CardContent className="pt-6">
            <p className="text-discord-error mb-4">{error || "Driver not found"}</p>
            <Button 
              onClick={() => navigate('/drivers')} 
              className="w-full bg-discord-accent hover:bg-discord-accent/80 text-white"
            >
              Back to Drivers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/drivers')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5 text-discord-muted" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-discord-text">
              {driver.name}
            </h1>
            <div className="flex items-center">
              <Badge variant="outline" className={`rounded-full ${getStatusColor(driver.status)}`}>
                {driver.status === "on-load" ? "On Load" : 
                  driver.status === "off-duty" ? "Off Duty" : "Available"}
              </Badge>
              <Badge variant="outline" className="ml-2 bg-discord-background border-none">
                <Truck className="mr-1 h-3 w-3" /> Truck #{driver.truck_number}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(true)}
              className="border-discord-accent text-discord-accent hover:bg-discord-accent/10"
            >
              <Clock className="mr-2 h-4 w-4" /> Update Status
            </Button>
            <DialogContent className="bg-discord-secondary border-discord-background">
              <DialogHeader>
                <DialogTitle className="text-discord-text">Update Driver Status</DialogTitle>
                <DialogDescription className="text-discord-muted">
                  Change the current status of {driver.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div
                    className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                      selectedStatus === "available"
                        ? "bg-discord-success bg-opacity-10 border border-discord-success"
                        : "bg-discord-background hover:bg-discord-background/80"
                    }`}
                    onClick={() => handleStatusChange("available")}
                  >
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-3 text-discord-success" />
                      <span className="text-discord-text">Available</span>
                    </div>
                    {selectedStatus === "available" && (
                      <CheckCircle className="h-4 w-4 text-discord-success" />
                    )}
                  </div>
                  
                  <div
                    className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                      selectedStatus === "on-load"
                        ? "bg-blue-500 bg-opacity-10 border border-blue-300"
                        : "bg-discord-background hover:bg-discord-background/80"
                    }`}
                    onClick={() => handleStatusChange("on-load")}
                  >
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 mr-3 text-blue-300" />
                      <span className="text-discord-text">On Load</span>
                    </div>
                    {selectedStatus === "on-load" && (
                      <CheckCircle className="h-4 w-4 text-blue-300" />
                    )}
                  </div>
                  
                  <div
                    className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                      selectedStatus === "off-duty"
                        ? "bg-discord-muted bg-opacity-10 border border-discord-muted"
                        : "bg-discord-background hover:bg-discord-background/80"
                    }`}
                    onClick={() => handleStatusChange("off-duty")}
                  >
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-discord-muted" />
                      <span className="text-discord-text">Off Duty</span>
                    </div>
                    {selectedStatus === "off-duty" && (
                      <CheckCircle className="h-4 w-4 text-discord-muted" />
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsStatusDialogOpen(false)}
                  className="text-discord-muted hover:text-discord-text"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveStatusChange}
                  className="bg-discord-accent hover:bg-discord-accent/80 text-white"
                >
                  Update Status
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="outline"
            onClick={() => setIsEditMode(true)}
            className="border-discord-accent text-discord-accent hover:bg-discord-accent/10"
          >
            <ClipboardEdit className="mr-2 h-4 w-4" /> Edit Driver
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Driver details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Driver Info */}
          <Card className="bg-discord-secondary border-discord-background">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <Avatar className="h-24 w-24 mr-6">
                  <AvatarFallback className="bg-discord-accent text-2xl">
                    {driver.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center text-discord-text">
                    <User className="mr-2 h-4 w-4 text-discord-muted" />
                    <span>{driver.name}</span>
                  </div>
                  <div className="flex items-center text-discord-text">
                    <Phone className="mr-2 h-4 w-4 text-discord-muted" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center text-discord-text">
                    <Mail className="mr-2 h-4 w-4 text-discord-muted" />
                    <span>{driver.email}</span>
                  </div>
                  <div className="flex items-center text-discord-text">
                    <Truck className="mr-2 h-4 w-4 text-discord-muted" />
                    <span>Truck #{driver.truck_number}</span>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-discord-background my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-discord-text font-medium mb-2">Current Location</h3>
                  <div className="flex items-center text-discord-text">
                    <MapPin className="mr-2 h-4 w-4 text-discord-muted" />
                    <span>{driver.current_location_city}, {driver.current_location_state}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-discord-text font-medium mb-2">Availability</h3>
                  {driver.status === "available" ? (
                    <div className="text-discord-text">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-discord-muted" />
                        <span>{formatDate(driver.available_date)}</span>
                      </div>
                      {driver.available_time && (
                        <div className="flex items-center mt-1">
                          <Clock className="mr-2 h-4 w-4 text-discord-muted" />
                          <span>{formatTime(driver.available_time)}</span>
                        </div>
                      )}
                    </div>
                  ) : driver.status === "on-load" ? (
                    <div className="text-discord-muted">Currently on a load</div>
                  ) : (
                    <div className="text-discord-muted">Off duty</div>
                  )}
                </div>
              </div>
              
              <Separator className="bg-discord-background my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-discord-text font-medium mb-2">License Information</h3>
                  <div className="flex items-center text-discord-text">
                    <FileText className="mr-2 h-4 w-4 text-discord-muted" />
                    <span>{driver.license_number} ({driver.license_state})</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-discord-muted hover:text-discord-text"
                  >
                    <Phone className="mr-1 h-4 w-4" /> Call Driver
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-discord-muted hover:text-discord-text"
                  >
                    <Mail className="mr-1 h-4 w-4" /> Email Driver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Load or Tabbed Content */}
          {currentLoad ? (
            <Card className="bg-discord-secondary border-discord-background">
              <CardHeader className="pb-0">
                <CardTitle className="text-discord-text">Current Assignment</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Link to={`/loads/${currentLoad.id}`}>
                  <div className="border border-discord-background rounded-md p-4 hover:bg-discord-background/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-discord-text">
                        {currentLoad.broker_name} - #{currentLoad.broker_load_number}
                      </div>
                      <Badge variant="outline" className={`${getStatusColor(currentLoad.status)}`}>
                        {currentLoad.status.charAt(0).toUpperCase() + currentLoad.status.slice(1).replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-discord-muted">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>
                          {currentLoad.pickup_city}, {currentLoad.pickup_state} → {currentLoad.delivery_city}, {currentLoad.delivery_state}
                        </span>
                      </div>
                      <div className="flex items-center text-discord-muted">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>
                          {formatDate(currentLoad.pickup_date)} - {formatDate(currentLoad.delivery_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-discord-secondary border-discord-background">
              <CardHeader className="pb-0">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-discord-background">
                    <TabsTrigger 
                      value="loads" 
                      className="data-[state=active]:bg-discord-accent data-[state=active]:text-white"
                    >
                      Load History
                    </TabsTrigger>
                    <TabsTrigger 
                      value="performance" 
                      className="data-[state=active]:bg-discord-accent data-[state=active]:text-white"
                    >
                      Performance
                    </TabsTrigger>
                    <TabsTrigger 
                      value="documents" 
                      className="data-[state=active]:bg-discord-accent data-[state=active]:text-white"
                    >
                      Documents
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="loads" className="mt-0">
                  <div className="space-y-4">
                    {loadHistory.length === 0 ? (
                      <div className="text-discord-muted py-10 text-center">No load history available</div>
                    ) : (
                      loadHistory.map((load) => (
                        <Link to={`/loads/${load.id}`} key={load.id}>
                          <div className="border border-discord-background rounded-md p-4 hover:bg-discord-background/50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-discord-text">
                                {load.broker_name} - #{load.broker_load_number}
                              </div>
                              <Badge variant="outline" className={`${getStatusColor(load.status)}`}>
                                {load.status.charAt(0).toUpperCase() + load.status.slice(1).replace("-", " ")}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center text-discord-muted">
                                <MapPin className="mr-2 h-4 w-4" />
                                <span>
                                  {load.pickup_city}, {load.pickup_state} → {load.delivery_city}, {load.delivery_state}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center text-discord-muted">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  <span>{formatDate(load.pickup_date)}</span>
                                </div>
                                <div className="text-discord-text">${load.rate.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="performance" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-discord-background p-4 rounded-md">
                        <div className="text-discord-muted text-sm">Loads Completed (30d)</div>
                        <div className="text-discord-text text-2xl font-bold">22</div>
                      </div>
                      <div className="bg-discord-background p-4 rounded-md">
                        <div className="text-discord-muted text-sm">On-Time Delivery</div>
                        <div className="text-discord-text text-2xl font-bold">96%</div>
                      </div>
                      <div className="bg-discord-background p-4 rounded-md">
                        <div className="text-discord-muted text-sm">Avg. Miles/Day</div>
                        <div className="text-discord-text text-2xl font-bold">330</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-discord-text font-medium">Monthly Performance</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b border-discord-background">
                            <tr>
                              <th className="text-left py-2 text-discord-muted">Month</th>
                              <th className="text-left py-2 text-discord-muted">Loads</th>
                              <th className="text-left py-2 text-discord-muted">On-Time %</th>
                              <th className="text-left py-2 text-discord-muted">Avg Miles/Day</th>
                            </tr>
                          </thead>
                          <tbody>
                            {performanceMetrics.map((metric, index) => (
                              <tr key={index} className="border-b border-discord-background">
                                <td className="py-2 text-discord-text">{metric.month}</td>
                                <td className="py-2 text-discord-text">{metric.loads_completed}</td>
                                <td className="py-2 text-discord-text">{metric.on_time_delivery_rate}%</td>
                                <td className="py-2 text-discord-text">{metric.average_miles_per_day}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="mt-0">
                  <div className="space-y-4">
                    {documents.length === 0 ? (
                      <div className="text-discord-muted py-10 text-center">No documents available</div>
                    ) : (
                      <div>
                        <div className="flex justify-end mb-4">
                          <Button 
                            variant="outline"
                            size="sm"
                            className="border-discord-accent text-discord-accent hover:bg-discord-accent/10"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" /> Upload Document
                          </Button>
                        </div>
                        {documents.map((doc) => (
                          <div 
                            key={doc.id}
                            className="border border-discord-background rounded-md p-4 mb-3 hover:bg-discord-background/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {getDocumentTypeIcon(doc.type)}
                                <span className="ml-2 text-discord-text">{doc.name}</span>
                              </div>
                              {doc.expiry_date && (
                                <Badge variant={
                                  new Date(doc.expiry_date) < new Date() ? 
                                    "destructive" : 
                                    new Date(doc.expiry_date).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000 ? 
                                      "outline" : "default"
                                }>
                                  {new Date(doc.expiry_date) < new Date() ? 
                                    "Expired" : 
                                    `Expires: ${formatDate(doc.expiry_date)}`
                                  }
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-discord-muted mt-1">
                              Uploaded: {formatDate(doc.upload_date)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-discord-secondary border-discord-background">
            <CardHeader className="pb-0">
              <CardTitle className="text-discord-text">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Button className="w-full bg-discord-accent hover:bg-discord-accent/80 text-white flex items-center justify-center">
                  <Truck className="mr-2 h-4 w-4" /> Assign to Load
                </Button>
                <Button variant="outline" className="w-full text-discord-muted hover:text-discord-text flex items-center justify-center">
                  <History className="mr-2 h-4 w-4" /> View Load History
                </Button>
                <Button variant="outline" className="w-full text-discord-muted hover:text-discord-text flex items-center justify-center">
                  <BarChart className="mr-2 h-4 w-4" /> View Performance
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-discord-secondary border-discord-background">
            <CardHeader className="pb-0">
              <CardTitle className="text-discord-text">Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Textarea
                      placeholder="Add a note about this driver..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="bg-discord-background border-discord-background resize-none"
                    />
                  </div>
                  <div className="flex justify-between">
                    <Select
                      defaultValue={noteType}
                      onValueChange={(value) => setNoteType(value as any)}
                    >
                      <SelectTrigger className="w-[150px] bg-discord-background border-discord-background">
                        <SelectValue placeholder="Note type" />
                      </SelectTrigger>
                      <SelectContent className="bg-discord-background border-discord-background">
                        <SelectItem value="general" className="text-green-300">General</SelectItem>
                        <SelectItem value="performance" className="text-blue-300">Performance</SelectItem>
                        <SelectItem value="maintenance" className="text-purple-300">Maintenance</SelectItem>
                        <SelectItem value="issue" className="text-discord-error">Issue</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      className="bg-discord-accent hover:bg-discord-accent/80 text-white"
                    >
                      <MessageSquarePlus className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </div>
                </div>

                <Separator className="bg-discord-background" />
                
                {notes.length === 0 ? (
                  <p className="text-discord-muted">No notes yet</p>
                ) : (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-discord-accent text-xs">
                              {note.user_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-discord-text font-medium">{note.user_name}</span>
                          <Badge variant="outline" className={`text-xs ${getNoteTypeColor(note.note_type)}`}>
                            {note.note_type.charAt(0).toUpperCase() + note.note_type.slice(1)}
                          </Badge>
                          <span className="text-discord-muted text-xs">{formatDateTime(note.created_at)}</span>
                        </div>
                        <p className="text-discord-text pl-8">{note.note_text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverDetail;

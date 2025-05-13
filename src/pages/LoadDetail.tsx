import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Thermometer,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Package,
  Phone,
  ClipboardEdit,
  FileText,
  Users,
  Plus,
  Truck,
  PlusCircle,
  LoaderCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with direct credentials
const supabaseUrl = "https://cfzlbsnnrveqbyyupupi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmemxic25ucnZlcWJ5eXVwdXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzE1MzU2MiwiZXhwIjoyMDYyNzI5NTYyfQ.41kCJhWCCnmREmlqxcmRmL-u0oULessR_20XBpO7B-4";
const supabase = createClient(supabaseUrl, supabaseKey);

// Types
type Location = {
  id: string;
  city: string;
  state: string;
  zipcode: string;
  date: string;
  time: string;
  sequence: number;
};

type LoadDetail = {
  id: string;
  broker_name: string;
  broker_load_number: string;
  load_type: string;
  temperature: string | null;
  rate: number;
  status: "booked" | "assigned" | "in-transit" | "delivered" | "cancelled";
  driver_id: string | null;
  pickup_locations: Location[];
  delivery_locations: Location[];
};

type Driver = {
  id: string;
  name: string;
  phone: string;
  truck_number: string;
};

type Note = {
  id: string;
  load_id: string;
  user_id: string;
  user_name: string;
  note_text: string;
  note_type: "general" | "customer" | "internal" | "issue";
  created_at: string;
};

type StatusHistoryItem = {
  status: string;
  timestamp: string;
  user: string;
};

const LoadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [load, setLoad] = useState<LoadDetail | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"general" | "customer" | "internal" | "issue">("general");
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAssigningDriver, setIsAssigningDriver] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch load details
  useEffect(() => {
    const fetchLoadDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // In a real app, we would fetch this data from Supabase
        // For now, we'll use mock data
        const mockLoad: LoadDetail = {
          id: id,
          broker_name: "ABC Logistics",
          broker_load_number: "BL1234",
          load_type: "Dry Van",
          temperature: null,
          rate: 2500,
          status: "booked",
          driver_id: null,
          pickup_locations: [
            {
              id: "pl1",
              city: "Dallas",
              state: "TX",
              zipcode: "75201",
              date: "2025-05-14",
              time: "08:00:00",
              sequence: 1,
            },
          ],
          delivery_locations: [
            {
              id: "dl1",
              city: "Houston",
              state: "TX",
              zipcode: "77001",
              date: "2025-05-15",
              time: "14:00:00",
              sequence: 1,
            },
          ],
        };

        setLoad(mockLoad);

        // Mock notes
        const mockNotes: Note[] = [
          {
            id: "n1",
            load_id: id,
            user_id: "u1",
            user_name: "John Admin",
            note_text: "Customer requested delivery before noon if possible",
            note_type: "customer",
            created_at: "2025-05-12T10:30:00",
          },
          {
            id: "n2",
            load_id: id,
            user_id: "u1",
            user_name: "John Admin",
            note_text: "Rate negotiated down from $2700",
            note_type: "internal",
            created_at: "2025-05-12T09:15:00",
          },
        ];

        setNotes(mockNotes);

        // Mock status history
        const mockStatusHistory: StatusHistoryItem[] = [
          {
            status: "booked",
            timestamp: "2025-05-12T09:00:00",
            user: "John Admin",
          },
        ];

        setStatusHistory(mockStatusHistory);

        // Mock available drivers
        const mockDrivers: Driver[] = [
          {
            id: "d1",
            name: "Mike Johnson",
            phone: "555-123-4567",
            truck_number: "T-101",
          },
          {
            id: "d2",
            name: "Sarah Williams",
            phone: "555-987-6543",
            truck_number: "T-202",
          },
          {
            id: "d3",
            name: "David Brown",
            phone: "555-246-8024",
            truck_number: "T-303",
          },
        ];

        setAvailableDrivers(mockDrivers);
      } catch (err) {
        console.error("Error fetching load details:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoadDetails();
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    if (!load) return;

    const statusMap: Record<string, "booked" | "assigned" | "in-transit" | "delivered" | "cancelled"> = {
      booked: "booked",
      assigned: "assigned",
      "in-transit": "in-transit",
      delivered: "delivered",
      cancelled: "cancelled",
    };

    const validStatus = statusMap[newStatus];
    if (!validStatus) return;

    // In a real app, we would update this in Supabase
    setLoad({ ...load, status: validStatus });

    // Add to status history
    const newStatusHistoryItem: StatusHistoryItem = {
      status: validStatus,
      timestamp: new Date().toISOString(),
      user: "Current User", // In a real app, get from auth context
    };

    setStatusHistory([newStatusHistoryItem, ...statusHistory]);

    toast({
      title: "Status Updated",
      description: `Load status changed to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace("-", " ")}`,
    });

    if (newStatus === "delivered") {
      // In a real app, trigger delivery confirmation workflow
      toast({
        title: "Delivery Complete",
        description: "Please ensure all delivery documentation is uploaded.",
      });
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !load) return;

    const newNoteItem: Note = {
      id: `n${Date.now()}`,
      load_id: load.id,
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
      description: "Your note has been added to this load",
    });
  };

  const handleAssignDriver = () => {
    if (!load || !selectedDriverId) return;

    const driver = availableDrivers.find(d => d.id === selectedDriverId);
    if (!driver) return;

    // In a real app, we would update this in Supabase
    setLoad({ ...load, driver_id: selectedDriverId });
    setDriver(driver);
    setIsAssigningDriver(false);

    // Update status if it's still 'booked'
    if (load.status === "booked") {
      handleStatusChange("assigned");
    }

    toast({
      title: "Driver Assigned",
      description: `${driver.name} has been assigned to this load`,
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "booked":
        return <AlertCircle className="h-5 w-5 text-blue-400" />;
      case "assigned":
        return <Users className="h-5 w-5 text-purple-400" />;
      case "in-transit":
        return <LoaderCircle className="h-5 w-5 text-yellow-400" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-discord-success" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-discord-error" />;
      default:
        return null;
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case "customer":
        return "bg-blue-500 bg-opacity-20 text-blue-300";
      case "internal":
        return "bg-purple-500 bg-opacity-20 text-purple-300";
      case "issue":
        return "bg-discord-error bg-opacity-20 text-discord-error";
      default: // general
        return "bg-green-500 bg-opacity-20 text-green-300";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "booked": return "bg-blue-500 bg-opacity-20 text-blue-300";
      case "assigned": return "bg-purple-500 bg-opacity-20 text-purple-300";
      case "in-transit": return "bg-yellow-500 bg-opacity-20 text-yellow-300";
      case "delivered": return "bg-discord-success bg-opacity-20 text-discord-success";
      case "cancelled": return "bg-discord-error bg-opacity-20 text-discord-error";
      default: return "";
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-170px)] md:h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-discord-accent rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-discord-muted">Loading load details...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !load) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-170px)] md:h-[calc(100vh-100px)]">
        <Card className="w-full max-w-md bg-discord-secondary border-discord-background">
          <CardContent className="pt-6">
            <p className="text-discord-error mb-4">{error || "Load not found"}</p>
            <Button 
              onClick={() => navigate('/loads')} 
              className="w-full bg-discord-accent hover:bg-discord-accent/80 text-white"
            >
              Back to Loads
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
            onClick={() => navigate('/loads')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5 text-discord-muted" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-discord-text">
              {load.broker_name} - #{load.broker_load_number}
            </h1>
            <div className="flex items-center">
              <Badge variant="outline" className={`rounded-full ${getStatusClass(load.status)}`}>
                {load.status.charAt(0).toUpperCase() + load.status.slice(1).replace("-", " ")}
              </Badge>
              {load.temperature && (
                <Badge variant="outline" className="ml-2 bg-blue-500 bg-opacity-20 text-blue-300 border-none">
                  <Thermometer className="mr-1 h-3 w-3" /> {load.temperature}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditMode(true)}
            className="border-discord-accent text-discord-accent hover:bg-discord-accent/10"
          >
            <ClipboardEdit className="mr-2 h-4 w-4" /> Edit Load
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Load details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pickup and Delivery */}
          <Card className="bg-discord-secondary border-discord-background">
            <CardHeader className="pb-0">
              <CardTitle className="text-discord-text">Route Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup */}
              <div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mr-4">
                    <MapPin className="h-4 w-4 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-discord-text font-medium">Pickup</h3>
                    {load.pickup_locations.map((location) => (
                      <div key={location.id} className="mt-2 space-y-2">
                        <p className="text-discord-text font-medium">
                          {location.city}, {location.state} {location.zipcode}
                        </p>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center text-discord-muted">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(location.date)}
                          </div>
                          <div className="flex items-center text-discord-muted">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(location.time)}
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm" className="text-discord-muted hover:text-discord-text">
                            <MapPin className="h-4 w-4 mr-1" /> Map
                          </Button>
                          <Button variant="outline" size="sm" className="text-discord-muted hover:text-discord-text">
                            <Phone className="h-4 w-4 mr-1" /> Call
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Separator className="bg-discord-background" />
              
              {/* Delivery */}
              <div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-discord-success bg-opacity-20 flex items-center justify-center mr-4">
                    <MapPin className="h-4 w-4 text-discord-success" />
                  </div>
                  <div>
                    <h3 className="text-discord-text font-medium">Delivery</h3>
                    {load.delivery_locations.map((location) => (
                      <div key={location.id} className="mt-2 space-y-2">
                        <p className="text-discord-text font-medium">
                          {location.city}, {location.state} {location.zipcode}
                        </p>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center text-discord-muted">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(location.date)}
                          </div>
                          <div className="flex items-center text-discord-muted">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(location.time)}
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm" className="text-discord-muted hover:text-discord-text">
                            <MapPin className="h-4 w-4 mr-1" /> Map
                          </Button>
                          <Button variant="outline" size="sm" className="text-discord-muted hover:text-discord-text">
                            <Phone className="h-4 w-4 mr-1" /> Call
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Load Details */}
          <Card className="bg-discord-secondary border-discord-background">
            <CardHeader className="pb-0">
              <CardTitle className="text-discord-text">Load Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-discord-muted text-sm">Rate</p>
                  <div className="flex items-center text-discord-text font-medium mt-1">
                    <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                    ${load.rate.toLocaleString()}
                  </div>
                </div>
                <div>
                  <p className="text-discord-muted text-sm">Load Type</p>
                  <div className="flex items-center text-discord-text font-medium mt-1">
                    <Package className="h-4 w-4 mr-1" />
                    {load.load_type}
                  </div>
                </div>
                {load.temperature && (
                  <div>
                    <p className="text-discord-muted text-sm">Temperature</p>
                    <div className="flex items-center text-discord-text font-medium mt-1">
                      <Thermometer className="h-4 w-4 mr-1 text-blue-400" />
                      {load.temperature}
                    </div>
                  </div>
                )}
              </div>

              <Separator className="bg-discord-background" />

              <div className="space-y-2">
                <p className="text-discord-muted text-sm">Status</p>
                <Select
                  defaultValue={load.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-[200px] bg-discord-background border-discord-background">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-discord-background border-discord-background">
                    <SelectItem value="booked" className="text-blue-300">Booked</SelectItem>
                    <SelectItem value="assigned" className="text-purple-300">Assigned</SelectItem>
                    <SelectItem value="in-transit" className="text-yellow-300">In Transit</SelectItem>
                    <SelectItem value="delivered" className="text-discord-success">Delivered</SelectItem>
                    <SelectItem value="cancelled" className="text-discord-error">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card className="bg-discord-secondary border-discord-background">
            <CardHeader className="pb-0">
              <CardTitle className="text-discord-text">Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-4">
                {statusHistory.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-8 mt-1">
                      {getStatusIcon(item.status)}
                    </div>
                    <p className="text-discord-text">
                      <span className={`font-medium ${getStatusClass(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace("-", " ")}
                      </span>
                    </p>
                    <p className="text-discord-muted text-sm">
                      {formatDateTime(item.timestamp)} by {item.user}
                    </p>
                  </div>
                ))}
                {statusHistory.length === 0 && (
                  <p className="text-discord-muted">No status history available</p>
                )}
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
                      placeholder="Add a note about this load..."
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
                        <SelectItem value="customer" className="text-blue-300">Customer</SelectItem>
                        <SelectItem value="internal" className="text-purple-300">Internal</SelectItem>
                        <SelectItem value="issue" className="text-discord-error">Issue</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      className="bg-discord-accent hover:bg-discord-accent/80 text-white"
                    >
                      <Send className="mr-2 h-4 w-4" /> Add Note
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

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* Driver Section */}
          <Card className="bg-discord-secondary border-discord-background">
            <CardHeader className="pb-0">
              <CardTitle className="text-discord-text">Driver Assignment</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {driver ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-discord-accent">
                        {driver.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-discord-text font-medium">{driver.name}</p>
                      <p className="text-discord-muted text-sm">Truck #{driver.truck_number}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center text-discord-muted hover:text-discord-text"
                    >
                      <Phone className="mr-1 h-4 w-4" /> Call
                    </Button>
                    <Dialog open={isAssigningDriver} onOpenChange={setIsAssigningDriver}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-discord-accent text-discord-accent hover:bg-discord-accent/10"
                        >
                          Change Driver
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-discord-secondary border-discord-background">
                        <DialogHeader>
                          <DialogTitle className="text-discord-text">Assign Driver</DialogTitle>
                          <DialogDescription className="text-discord-muted">
                            Select a driver to assign to this load
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {availableDrivers.map((driver) => (
                            <div
                              key={driver.id}
                              className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                                selectedDriverId === driver.id
                                  ? "bg-discord-accent bg-opacity-20 border border-discord-accent"
                                  : "bg-discord-background hover:bg-discord-background/80"
                              }`}
                              onClick={() => setSelectedDriverId(driver.id)}
                            >
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarFallback className="bg-discord-accent">
                                    {driver.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-discord-text font-medium">{driver.name}</p>
                                  <p className="text-discord-muted text-sm">Truck #{driver.truck_number}</p>
                                </div>
                              </div>
                              {selectedDriverId === driver.id && (
                                <CheckCircle className="h-5 w-5 text-discord-accent" />
                              )}
                            </div>
                          ))}
                        </div>
                        <DialogFooter className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => setIsAssigningDriver(false)}
                            className="text-discord-muted hover:text-discord-text"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAssignDriver}
                            disabled={!selectedDriverId}
                            className="bg-discord-accent hover:bg-discord-accent/80 text-white"
                          >
                            Assign Driver
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-discord-background flex items-center justify-center">
                    <Truck className="h-8 w-8 text-discord-muted" />
                  </div>
                  <p className="text-discord-muted">No driver assigned yet</p>
                  <Dialog open={isAssigningDriver} onOpenChange={setIsAssigningDriver}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-discord-accent hover:bg-discord-accent/80 text-white"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Assign Driver
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-discord-secondary border-discord-background">
                      <DialogHeader>
                        <DialogTitle className="text-discord-text">Assign Driver</DialogTitle>
                        <DialogDescription className="text-discord-muted">
                          Select a driver to assign to this load
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {availableDrivers.map((driver) => (
                          <div
                            key={driver.id}
                            className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                              selectedDriverId === driver.id
                                ? "bg-discord-accent bg-opacity-20 border border-discord-accent"
                                : "bg-discord-background hover:bg-discord-background/80"
                            }`}
                            onClick={() => setSelectedDriverId(driver.id)}
                          >
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarFallback className="bg-discord-accent">
                                  {driver.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-discord-text font-medium">{driver.name}</p>
                                <p className="text-discord-muted text-sm">Truck #{driver.truck_number}</p>
                              </div>
                            </div>
                            {selectedDriverId === driver.id && (
                              <CheckCircle className="h-5 w-5 text-discord-accent" />
                            )}
                          </div>
                        ))}
                      </div>
                      <DialogFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setIsAssigningDriver(false)}
                          className="text-discord-muted hover:text-discord-text"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAssignDriver}
                          disabled={!selectedDriverId}
                          className="bg-discord-accent hover:bg-discord-accent/80 text-white"
                        >
                          Assign Driver
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="bg-discord-secondary border-discord-background">
            <CardHeader className="pb-0">
              <CardTitle className="text-discord-text">Documents</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col items-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-discord-background flex items-center justify-center">
                  <FileText className="h-8 w-8 text-discord-muted" />
                </div>
                <p className="text-discord-muted">No documents yet</p>
                <Button 
                  variant="outline"
                  className="border-discord-accent text-discord-accent hover:bg-discord-accent/10"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoadDetail;

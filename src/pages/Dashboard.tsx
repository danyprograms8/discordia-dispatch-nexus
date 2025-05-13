
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Truck, 
  Users, 
  Calendar as CalendarIcon, 
  Check, 
  PlusCircle, 
  UserPlus, 
  MessageSquarePlus
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Types
type MetricData = {
  activeLoads: number;
  availableDrivers: number;
  todayPickups: number;
  todayDeliveries: number;
};

type ChartData = {
  date: string;
  loads: number;
};

type ActivityItem = {
  id: string;
  description: string;
  timestamp: string;
  status: string;
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState<MetricData>({
    activeLoads: 0,
    availableDrivers: 0,
    todayPickups: 0,
    todayDeliveries: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // In a real app, we would fetch this data from Supabase
        // For now, we'll use mock data
        
        // Mock metrics data
        setMetrics({
          activeLoads: 12,
          availableDrivers: 8,
          todayPickups: 5,
          todayDeliveries: 7,
        });

        // Mock chart data for the last 7 days
        const today = new Date();
        const mockChartData: ChartData[] = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          mockChartData.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            loads: Math.floor(Math.random() * 8) + 2, // Random number between 2-10
          });
        }
        
        setChartData(mockChartData);

        // Mock activity data
        setActivity([
          {
            id: "1",
            description: "Load #L1234 changed to In Transit",
            timestamp: "2 hours ago",
            status: "in-transit",
          },
          {
            id: "2",
            description: "John Doe assigned to Load #L5678",
            timestamp: "4 hours ago",
            status: "assigned",
          },
          {
            id: "3",
            description: "Load #L9012 delivered successfully",
            timestamp: "8 hours ago",
            status: "delivered",
          },
          {
            id: "4",
            description: "New load #L3456 booked with ABC Logistics",
            timestamp: "Yesterday",
            status: "booked",
          },
          {
            id: "5",
            description: "Mike Johnson marked as available",
            timestamp: "Yesterday",
            status: "available",
          },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "booked": return "bg-blue-500 bg-opacity-20 text-blue-300";
      case "assigned": return "bg-purple-500 bg-opacity-20 text-purple-300";
      case "in-transit": return "bg-yellow-500 bg-opacity-20 text-yellow-300";
      case "delivered": return "bg-discord-success bg-opacity-20 text-discord-success";
      case "cancelled": return "bg-discord-error bg-opacity-20 text-discord-error";
      case "available": return "bg-blue-500 bg-opacity-20 text-blue-300";
      default: return "bg-gray-500 bg-opacity-20 text-gray-300";
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-170px)] md:h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-discord-accent rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-discord-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-170px)] md:h-[calc(100vh-100px)]">
        <Card className="w-full max-w-md bg-discord-secondary border-discord-background">
          <CardHeader>
            <CardTitle className="text-discord-error">Error</CardTitle>
            <CardDescription className="text-discord-muted">{error}</CardDescription>
          </CardHeader>
          <CardContent>
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
      <div>
        <h1 className="text-2xl font-bold text-discord-text">Dashboard</h1>
        <p className="text-discord-muted">Overview of your trucking operations</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-discord-secondary border-discord-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-discord-muted">Active Loads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-discord-text">{metrics.activeLoads}</div>
              <div className="p-2 rounded-full bg-discord-accent bg-opacity-20">
                <Truck className="w-5 h-5 text-discord-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-discord-secondary border-discord-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-discord-muted">Available Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-discord-text">{metrics.availableDrivers}</div>
              <div className="p-2 rounded-full bg-green-500 bg-opacity-20">
                <Users className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-discord-secondary border-discord-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-discord-muted">Today's Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-discord-text">{metrics.todayPickups}</div>
              <div className="p-2 rounded-full bg-yellow-500 bg-opacity-20">
                <CalendarIcon className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-discord-secondary border-discord-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-discord-muted">Today's Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-discord-text">{metrics.todayDeliveries}</div>
              <div className="p-2 rounded-full bg-discord-success bg-opacity-20">
                <Check className="w-5 h-5 text-discord-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <Card className="bg-discord-secondary border-discord-background col-span-2">
          <CardHeader>
            <CardTitle className="text-discord-text">Loads Booked (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4f545c" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#DCDDDE" 
                    tick={{ fill: "#DCDDDE" }}
                  />
                  <YAxis stroke="#DCDDDE" tick={{ fill: "#DCDDDE" }} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "#36393F", 
                      borderColor: "#2F3136",
                      color: "#FFFFFF"
                    }}
                    labelStyle={{ color: "#FFFFFF" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="loads"
                    stroke="#7289DA"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#7289DA", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#7289DA", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="bg-discord-secondary border-discord-background">
          <CardHeader>
            <CardTitle className="text-discord-text">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getStatusClass(item.status)}`} />
                  <div className="space-y-1">
                    <p className="text-sm text-discord-text">{item.description}</p>
                    <p className="text-xs text-discord-muted">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-discord-secondary border-discord-background">
        <CardHeader>
          <CardTitle className="text-discord-text">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/loads">
              <Button className="w-full bg-discord-accent hover:bg-discord-accent/80 text-white flex items-center justify-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Load
              </Button>
            </Link>
            <Link to="/drivers">
              <Button variant="outline" className="w-full border-discord-accent text-discord-accent hover:bg-discord-accent/10 flex items-center justify-center">
                <UserPlus className="mr-2 h-4 w-4" /> Assign Driver
              </Button>
            </Link>
            <Link to="/loads">
              <Button variant="outline" className="w-full border-discord-accent text-discord-accent hover:bg-discord-accent/10 flex items-center justify-center">
                <MessageSquarePlus className="mr-2 h-4 w-4" /> Add Note
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

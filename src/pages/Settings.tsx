
import { useState } from "react";
import {
  User,
  Bell,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  LogOut,
  Save,
  RefreshCw,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const Settings = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user profile settings
  const [profile, setProfile] = useState({
    displayName: "Admin User",
    email: "admin@example.com",
    phone: "555-123-4567",
  });

  // Mock notification settings
  const [notifications, setNotifications] = useState({
    newLoad: true,
    loadAssigned: true,
    driverUpdate: true,
    pickupReminder: true,
    deliveryReminder: true,
    statusChanges: true,
  });

  // Mock WhatsApp integration settings
  const [whatsappSettings, setWhatsappSettings] = useState({
    enabled: false,
    phoneNumber: "",
    pickupLeadTime: 2,
    deliveryLeadTime: 2,
  });

  // Mock display settings
  const [displaySettings, setDisplaySettings] = useState({
    darkMode: true,
    compactView: false,
    showDriverLocation: true,
    autoRefresh: true,
    refreshInterval: 5,
  });

  const handleProfileUpdate = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated.",
      });
    }, 1000);
  };

  const handleNotificationUpdate = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    }, 1000);
  };

  const handleWhatsAppUpdate = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "WhatsApp Settings Updated",
        description: "Your WhatsApp integration settings have been saved.",
      });
    }, 1000);
  };

  const handleDisplayUpdate = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsDarkMode(displaySettings.darkMode);
      
      toast({
        title: "Display Settings Updated",
        description: "Your display preferences have been saved.",
      });
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-discord-text">Settings</h1>
        <p className="text-discord-muted">Manage your account preferences</p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-discord-secondary mb-6">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-discord-accent data-[state=active]:text-white text-discord-muted"
          >
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="data-[state=active]:bg-discord-accent data-[state=active]:text-white text-discord-muted"
          >
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="whatsapp" 
            className="data-[state=active]:bg-discord-accent data-[state=active]:text-white text-discord-muted"
          >
            <Smartphone className="h-4 w-4 mr-2" /> WhatsApp
          </TabsTrigger>
          <TabsTrigger 
            value="display" 
            className="data-[state=active]:bg-discord-accent data-[state=active]:text-white text-discord-muted"
          >
            <Monitor className="h-4 w-4 mr-2" /> Display
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-discord-secondary border-discord-background">
            <CardHeader>
              <CardTitle className="text-discord-text">Profile Information</CardTitle>
              <CardDescription className="text-discord-muted">
                Manage your personal information and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-discord-text">Display Name</Label>
                <Input
                  id="displayName"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="bg-discord-background border-discord-background text-discord-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-discord-text">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="bg-discord-background border-discord-background text-discord-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-discord-text">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="bg-discord-background border-discord-background text-discord-text"
                />
              </div>
              
              <Separator className="bg-discord-background my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-discord-text">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  className="bg-discord-background border-discord-background text-discord-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-discord-text">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  className="bg-discord-background border-discord-background text-discord-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-discord-text">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="bg-discord-background border-discord-background text-discord-text"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="text-white"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
              <Button 
                onClick={handleProfileUpdate}
                disabled={isLoading}
                className="bg-discord-accent hover:bg-discord-accent/80 text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="bg-discord-secondary border-discord-background">
            <CardHeader>
              <CardTitle className="text-discord-text">Notification Preferences</CardTitle>
              <CardDescription className="text-discord-muted">
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-discord-text">New Load Booked</Label>
                    <p className="text-xs text-discord-muted">
                      Receive notifications when a new load is booked
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newLoad}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newLoad: checked })}
                    className="data-[state=checked]:bg-discord-accent"
                  />
                </div>
                
                <Separator className="bg-discord-background" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-discord-text">Load Assigned</Label>
                    <p className="text-xs text-discord-muted">
                      Receive notifications when a load is assigned to a driver
                    </p>
                  </div>
                  <Switch
                    checked={notifications.loadAssigned}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, loadAssigned: checked })}
                    className="data-[state=checked]:bg-discord-accent"
                  />
                </div>
                
                <Separator className="bg-discord-background" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-discord-text">Driver Update Needed</Label>
                    <p className="text-xs text-discord-muted">
                      Receive notifications when a driver update is required
                    </p>
                  </div>
                  <Switch
                    checked={notifications.driverUpdate}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, driverUpdate: checked })}
                    className="data-[state=checked]:bg-discord-accent"
                  />
                </div>
                
                <Separator className="bg-discord-background" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-discord-text">Pickup Reminder</Label>
                    <p className="text-xs text-discord-muted">
                      Receive reminders before scheduled pickups
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pickupReminder}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pickupReminder: checked })}
                    className="data-[state=checked]:bg-discord-accent"
                  />
                </div>
                
                <Separator className="bg-discord-background" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-discord-text">Delivery Reminder</Label>
                    <p className="text-xs text-discord-muted">
                      Receive reminders before scheduled deliveries
                    </p>
                  </div>
                  <Switch
                    checked={notifications.deliveryReminder}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, deliveryReminder: checked })}
                    className="data-[state=checked]:bg-discord-accent"
                  />
                </div>
                
                <Separator className="bg-discord-background" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-discord-text">Status Changes</Label>
                    <p className="text-xs text-discord-muted">
                      Receive notifications when load status changes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.statusChanges}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, statusChanges: checked })}
                    className="data-[state=checked]:bg-discord-accent"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleNotificationUpdate}
                disabled={isLoading}
                className="bg-discord-accent hover:bg-discord-accent/80 text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Preferences
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* WhatsApp Tab */}
        <TabsContent value="whatsapp">
          <Card className="bg-discord-secondary border-discord-background">
            <CardHeader>
              <CardTitle className="text-discord-text">WhatsApp Integration</CardTitle>
              <CardDescription className="text-discord-muted">
                Configure WhatsApp notifications for drivers and customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-discord-text">Enable WhatsApp Integration</Label>
                  <p className="text-xs text-discord-muted">
                    Send notifications and alerts via WhatsApp
                  </p>
                </div>
                <Switch
                  checked={whatsappSettings.enabled}
                  onCheckedChange={(checked) => setWhatsappSettings({ ...whatsappSettings, enabled: checked })}
                  className="data-[state=checked]:bg-discord-accent"
                />
              </div>
              
              <Separator className="bg-discord-background" />
              
              <div className={whatsappSettings.enabled ? "space-y-4" : "space-y-4 opacity-50 pointer-events-none"}>
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber" className="text-discord-text">WhatsApp Phone Number</Label>
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    placeholder="+1234567890"
                    value={whatsappSettings.phoneNumber}
                    onChange={(e) => setWhatsappSettings({ ...whatsappSettings, phoneNumber: e.target.value })}
                    className="bg-discord-background border-discord-background text-discord-text"
                    disabled={!whatsappSettings.enabled}
                  />
                  <p className="text-xs text-discord-muted">
                    Enter the phone number with country code
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickupLeadTime" className="text-discord-text">Pickup Reminder Lead Time</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="pickupLeadTime"
                      type="number"
                      min={0}
                      value={whatsappSettings.pickupLeadTime}
                      onChange={(e) => setWhatsappSettings({ 
                        ...whatsappSettings, 
                        pickupLeadTime: parseInt(e.target.value) || 0 
                      })}
                      className="bg-discord-background border-discord-background text-discord-text"
                      disabled={!whatsappSettings.enabled}
                    />
                    <span className="text-discord-text">hours before</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryLeadTime" className="text-discord-text">Delivery Reminder Lead Time</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="deliveryLeadTime"
                      type="number"
                      min={0}
                      value={whatsappSettings.deliveryLeadTime}
                      onChange={(e) => setWhatsappSettings({ 
                        ...whatsappSettings, 
                        deliveryLeadTime: parseInt(e.target.value) || 0 
                      })}
                      className="bg-discord-background border-discord-background text-discord-text"
                      disabled={!whatsappSettings.enabled}
                    />
                    <span className="text-discord-text">hours before</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleWhatsAppUpdate}
                disabled={isLoading}
                className="bg-discord-accent hover:bg-discord-accent/80 text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Integration Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display">
          <Card className="bg-discord-secondary border-discord-background">
            <CardHeader>
              <CardTitle className="text-discord-text">Display Settings</CardTitle>
              <CardDescription className="text-discord-muted">
                Customize your application appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2 items-center">
                  <Moon className="h-4 w-4 text-discord-muted" />
                  <Label className="text-discord-text">Dark Mode</Label>
                </div>
                <Switch
                  checked={displaySettings.darkMode}
                  onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, darkMode: checked })}
                  className="data-[state=checked]:bg-discord-accent"
                />
              </div>
              
              <Separator className="bg-discord-background" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-discord-text">Compact View</Label>
                  <p className="text-xs text-discord-muted">
                    Show more content on screen with reduced spacing
                  </p>
                </div>
                <Switch
                  checked={displaySettings.compactView}
                  onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, compactView: checked })}
                  className="data-[state=checked]:bg-discord-accent"
                />
              </div>
              
              <Separator className="bg-discord-background" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-discord-text">Show Driver Location</Label>
                  <p className="text-xs text-discord-muted">
                    Display driver locations on lists and cards
                  </p>
                </div>
                <Switch
                  checked={displaySettings.showDriverLocation}
                  onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, showDriverLocation: checked })}
                  className="data-[state=checked]:bg-discord-accent"
                />
              </div>
              
              <Separator className="bg-discord-background" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-discord-text">Auto-refresh Data</Label>
                    <p className="text-xs text-discord-muted">
                      Automatically refresh data at regular intervals
                    </p>
                  </div>
                  <Switch
                    checked={displaySettings.autoRefresh}
                    onCheckedChange={(checked) => setDisplaySettings({ ...displaySettings, autoRefresh: checked })}
                    className="data-[state=checked]:bg-discord-accent"
                  />
                </div>
                
                {displaySettings.autoRefresh && (
                  <div className="space-y-2">
                    <Label htmlFor="refreshInterval" className="text-discord-text">Refresh Interval (minutes)</Label>
                    <Input
                      id="refreshInterval"
                      type="number"
                      min={1}
                      max={60}
                      value={displaySettings.refreshInterval}
                      onChange={(e) => setDisplaySettings({ 
                        ...displaySettings, 
                        refreshInterval: parseInt(e.target.value) || 5 
                      })}
                      className="bg-discord-background border-discord-background text-discord-text"
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleDisplayUpdate}
                disabled={isLoading}
                className="bg-discord-accent hover:bg-discord-accent/80 text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Display Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

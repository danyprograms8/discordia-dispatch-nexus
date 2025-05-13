
import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Home, 
  Truck, 
  Users,
  Calendar as CalendarIcon, 
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Layout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Close sidebar on route change on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navigationItems = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/dashboard" },
    { name: "Loads", icon: <Truck className="h-5 w-5" />, path: "/loads" },
    { name: "Drivers", icon: <Users className="h-5 w-5" />, path: "/drivers" },
    { name: "Calendar", icon: <CalendarIcon className="h-5 w-5" />, path: "/calendar" },
    { name: "Settings", icon: <SettingsIcon className="h-5 w-5" />, path: "/settings" },
  ];

  const NavLink = ({ item }: { item: { name: string, icon: JSX.Element, path: string } }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        to={item.path}
        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
          isActive
            ? "bg-discord-accent text-white"
            : "text-discord-muted hover:bg-discord-secondary hover:text-white"
        }`}
      >
        <span className="mr-3">{item.icon}</span>
        <span>{item.name}</span>
      </Link>
    );
  };

  const renderMobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-discord-secondary border-t border-discord-background z-50">
      <div className="flex justify-around">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center p-3 ${
              location.pathname === item.path
                ? "text-discord-accent"
                : "text-discord-muted"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="hidden md:flex flex-col h-screen w-64 bg-discord-secondary fixed left-0 top-0 z-40">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white">TruckMaster</h1>
        <p className="text-discord-muted text-sm">Load Management</p>
      </div>
      <Separator className="bg-discord-background" />
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
      </div>
      <Separator className="bg-discord-background" />
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-discord-accent">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.user_metadata?.full_name || user?.email}
            </p>
            <p className="text-xs text-discord-muted truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="text-discord-muted hover:text-discord-error hover:bg-discord-error/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMobileHeader = () => (
    <div className="flex items-center justify-between p-4 border-b border-discord-secondary bg-discord-background md:hidden">
      <h1 className="text-xl font-bold text-white">TruckMaster</h1>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-discord-muted">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-discord-secondary border-discord-background p-0 w-64">
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-discord-muted"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Separator className="bg-discord-background" />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {navigationItems.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>
            <Separator className="bg-discord-background" />
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-discord-accent">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-discord-muted truncate">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  className="text-discord-muted hover:text-discord-error"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <div className="bg-discord-background text-discord-text min-h-screen">
      {renderSidebar()}
      {renderMobileHeader()}
      <main className="md:ml-64 pb-16 md:pb-0">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
      {isMobile && renderMobileNav()}
    </div>
  );
};

export default Layout;

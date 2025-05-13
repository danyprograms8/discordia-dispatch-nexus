
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

// Define types
type User = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define Supabase credentials directly
const supabaseUrl = "https://cfzlbsnnrveqbyyupupi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmemxic25ucnZlcWJ5eXVwdXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzE1MzU2MiwiZXhwIjoyMDYyNzI5NTYyfQ.41kCJhWCCnmREmlqxcmRmL-u0oULessR_20XBpO7B-4";

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Create a mock user for testing purposes
  const mockUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    user_metadata: {
      full_name: "Test User"
    }
  };
  
  // Set the user to the mock user and loading to false
  const [user, setUser] = useState<User | null>(mockUser);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock sign in function
  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoading(true);
      // Mock successful login
      toast({
        title: "Sign in successful",
        description: `Welcome back, ${mockUser.user_metadata?.full_name || email}!`,
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock forgot password function
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send reset email",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

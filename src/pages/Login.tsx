
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const { user, loading, signIn, forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (resetPasswordMode) {
      try {
        setIsLoading(true);
        await forgotPassword(email);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    try {
      setIsLoading(true);
      await signIn(email, password, rememberMe);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleMode = () => {
    setResetPasswordMode(!resetPasswordMode);
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-discord-background p-4">
      <Card className="w-full max-w-md bg-discord-secondary border-discord-background">
        <CardHeader className="space-y-2 items-center text-center">
          <div className="w-16 h-16 bg-discord-accent rounded-full flex items-center justify-center mb-2">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">TruckMaster</CardTitle>
          <CardDescription className="text-discord-muted">
            {resetPasswordMode
              ? "Enter your email to receive a password reset link"
              : "Sign in to manage your trucking operations"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-discord-text">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="bg-discord-background border-discord-background text-discord-text"
              />
            </div>
            {!resetPasswordMode && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-discord-text">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-discord-background border-discord-background text-discord-text"
                />
              </div>
            )}
            {!resetPasswordMode && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => 
                    setRememberMe(checked === true)
                  }
                  className="data-[state=checked]:bg-discord-accent data-[state=checked]:border-discord-accent"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-discord-muted"
                >
                  Remember me
                </Label>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-discord-accent hover:bg-discord-accent/80 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⟳</span> 
                  {resetPasswordMode ? "Sending..." : "Signing in..."}
                </span>
              ) : (
                resetPasswordMode ? "Send Reset Link" : "Sign In"
              )}
            </Button>
            <Button
              type="button"
              variant="link"
              className="text-discord-accent hover:text-discord-accent/80"
              onClick={toggleMode}
            >
              {resetPasswordMode
                ? "Back to sign in"
                : "Forgot your password?"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;

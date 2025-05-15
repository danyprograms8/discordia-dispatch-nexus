
import { useState } from 'react';
import { toast as sonnerToast, type ToastT } from 'sonner';

interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}

interface ExtendedToastT extends ToastT {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ExtendedToastT[]>([]);

  const toast = ({ title, description, action, variant = "default", duration = 5000 }: ToastProps) => {
    const id = sonnerToast(title, {
      description,
      action,
      duration,
      className: variant === "destructive" ? "destructive-toast" : "",
    });
    
    // Store additional props we need for our custom Toast component
    const newToast = { 
      id, 
      title, 
      description,
      action,
      variant // Include variant for shadcn/ui Toast mapping
    } as ExtendedToastT;
    
    setToasts((prev) => [...prev, newToast]);
    
    return id;
  };

  const dismiss = (toastId?: string | number) => {
    if (toastId) {
      sonnerToast.dismiss(toastId);
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }
  };

  return { toast, dismiss, toasts };
};

export { toast as toast } from 'sonner';

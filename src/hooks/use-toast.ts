
import { useState } from 'react';
import { toast as sonnerToast, type ToastT } from 'sonner';

interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  type?: "success" | "error" | "info" | "warning";
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastT[]>([]);

  const toast = ({ title, description, action, variant = "default", type, duration = 5000 }: ToastProps) => {
    // Map our variant to sonner toast type if type is not provided
    const mappedType = type || (variant === "destructive" ? "error" : "default");
    
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
    } as unknown as ToastT;
    
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

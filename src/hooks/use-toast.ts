
import { useState } from 'react';
import { toast as sonnerToast, type Toast } from 'sonner';

interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, action, variant = "default", duration = 5000 }: ToastProps) => {
    const id = sonnerToast(title, {
      description,
      action,
      duration,
      className: variant === "destructive" ? "destructive-toast" : ""
    });
    
    setToasts((prev) => [...prev, { id, title, description }]);
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

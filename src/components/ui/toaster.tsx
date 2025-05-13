
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Since the sonner toast doesn't have a variant property directly,
        // we use the props from our useToast hook which adds this
        const toastVariant = (props as any).variant || "default";
        
        // Map our variant to either "foreground" or "background" for shadcn/ui Toast
        // Explicitly constrain the type to be only "foreground" or "background"
        const toastType: "foreground" | "background" = 
          toastVariant === "destructive" ? "foreground" : "background";
        
        return (
          <Toast key={id} type={toastType} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action && <div className="action">{action as React.ReactNode}</div>}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

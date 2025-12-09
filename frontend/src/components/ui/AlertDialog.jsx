import React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogContent = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <AlertDialogPrimitive.Portal>
    <AlertDialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in" />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border border-border p-8 rounded-xl shadow-2xl z-50 w-full max-w-md animate-in fade-in zoom-in-95 ${className}`}
      {...props}
    >
      {children}
    </AlertDialogPrimitive.Content>
  </AlertDialogPrimitive.Portal>
));

const AlertDialogTitle = React.forwardRef(({ className = '', ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={`text-xl font-bold text-foreground ${className}`}
    {...props}
  />
));

const AlertDialogDescription = React.forwardRef(({ className = '', ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={`text-base text-muted-foreground mt-3 ${className}`}
    {...props}
  />
));

const AlertDialogAction = React.forwardRef(({ className = '', ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={`inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-11 py-3 px-6 shadow-md hover:shadow-lg active:scale-95 ${className || 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}`}
    {...props}
  />
));

const AlertDialogCancel = React.forwardRef(({ className = '', ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={`inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-11 py-3 px-6 border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 active:scale-95 ${className}`}
    {...props}
  />
));

const AlertDialogHeader = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-2 mb-2 ${className}`} {...props}>
    {children}
  </div>
);

const AlertDialogFooter = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 mt-8 gap-3 sm:gap-0 ${className}`} {...props}>
    {children}
  </div>
);

AlertDialogContent.displayName = 'AlertDialogContent';
AlertDialogTitle.displayName = 'AlertDialogTitle';
AlertDialogDescription.displayName = 'AlertDialogDescription';
AlertDialogAction.displayName = 'AlertDialogAction';
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
};
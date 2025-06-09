import React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogContent = React.forwardRef(({ children, ...props }, ref) => (
  <AlertDialogPrimitive.Portal>
    <AlertDialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
    <AlertDialogPrimitive.Content
      ref={ref}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg"
      {...props}
    >
      {children}
    </AlertDialogPrimitive.Content>
  </AlertDialogPrimitive.Portal>
));

const AlertDialogTitle = AlertDialogPrimitive.Title;
const AlertDialogDescription = AlertDialogPrimitive.Description;
const AlertDialogAction = AlertDialogPrimitive.Action;
const AlertDialogCancel = AlertDialogPrimitive.Cancel;

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
};
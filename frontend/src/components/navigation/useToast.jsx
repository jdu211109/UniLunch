// src/components/navigation/useToast.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = ({
    title,
    description,
    variant = "default",
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-md p-4 shadow-md ${
              t.variant === "destructive"
                ? "bg-destructive text-destructive-foreground"
                : "bg-background border"
            }`}
          >
            {t.title && <div className="font-medium">{t.title}</div>}
            {t.description && <div className="text-sm mt-1">{t.description}</div>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return { toast, ToastContainer };
}
// src/components/navigation/useToast.js
import React, { useState } from "react";

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
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-md p-4 shadow-md transition-all duration-300 ${
            t.variant === "destructive"
              ? "bg-red-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          {t.title && <div className="font-medium">{t.title}</div>}
          {t.description && <div className="text-sm mt-1">{t.description}</div>}
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
}
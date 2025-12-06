"use client";

import { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "warning";

interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      <div className="fixed top-4 right-4 flex flex-col gap-3 z-[9999]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-4 py-3 rounded-lg shadow-lg text-white animate-slideIn
              ${toast.type === "success" ? "bg-green-600" : ""}
              ${toast.type === "error" ? "bg-red-600" : ""}
              ${toast.type === "warning" ? "bg-yellow-500" : ""}
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

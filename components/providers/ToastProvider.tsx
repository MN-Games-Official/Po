"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from "react";

import { Toast, type ToastMessage } from "@/components/ui/Toast";

type ToastAction =
  | { type: "ADD"; message: ToastMessage }
  | { type: "REMOVE"; id: string };

type ToastContextValue = {
  messages: ToastMessage[];
  push: (message: Omit<ToastMessage, "id">) => void;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function reducer(state: ToastMessage[], action: ToastAction) {
  switch (action.type) {
    case "ADD":
      return [...state, action.message];
    case "REMOVE":
      return state.filter((message) => message.id !== action.id);
    default:
      return state;
  }
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [messages, dispatch] = useReducer(reducer, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      messages,
      push(message) {
        const id = crypto.randomUUID();
        dispatch({ type: "ADD", message: { ...message, id } });
        window.setTimeout(() => {
          dispatch({ type: "REMOVE", id });
        }, 4200);
      },
      remove(id) {
        dispatch({ type: "REMOVE", id });
      },
    }),
    [messages],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-3">
        {messages.map((message) => (
          <div key={message.id} className="pointer-events-auto">
            <Toast message={message} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used inside ToastProvider");
  }

  return context;
}


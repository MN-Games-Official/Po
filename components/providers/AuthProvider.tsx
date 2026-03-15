"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from "react";

import type { AuthState, SessionUser } from "@/types/domain";

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; user: SessionUser; accessToken?: string | null }
  | { type: "AUTH_LOGOUT" }
  | { type: "AUTH_IDLE"; user: SessionUser | null };

type AuthContextValue = AuthState & {
  dispatch: Dispatch<AuthAction>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, status: "loading" };
    case "AUTH_SUCCESS":
      return {
        status: "authenticated",
        user: action.user,
        accessToken: action.accessToken ?? state.accessToken,
      };
    case "AUTH_LOGOUT":
      return {
        status: "anonymous",
        user: null,
        accessToken: null,
      };
    case "AUTH_IDLE":
      return {
        status: action.user ? "authenticated" : "anonymous",
        user: action.user,
        accessToken: null,
      };
    default:
      return state;
  }
}

export function AuthProvider({
  children,
  initialUser,
}: PropsWithChildren<{ initialUser: SessionUser | null }>) {
  const [state, dispatch] = useReducer(reducer, {
    status: initialUser ? "authenticated" : "anonymous",
    user: initialUser,
    accessToken: null,
  });

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}

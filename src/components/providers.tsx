"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User } from "@/lib/store";
const theme = createTheme({
  palette: { primary: { main: "#1668E8" }, secondary: { main: "#FF681C" } },
  typography: {
    fontFamily: "var(--font-jakarta), Arial, sans-serif",
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { minHeight: 44, paddingInline: 22 } },
    },
    MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 18 } } },
  },
});
type SafeUser = Omit<User, "passwordHash">;
const AuthContext = createContext<{
  user: SafeUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
}>({ user: null, loading: true, refresh: async () => {} });
export async function api<T = Record<string, unknown>>(
  action: string,
  data?: unknown,
): Promise<T> {
  const res = await fetch(
    data !== undefined ? "/api/platform" : `/api/platform?action=${action}`,
    data !== undefined
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...(data as object) }),
        }
      : { cache: "no-store" },
  );
  const body = await res.json();
  if (!res.ok)
    throw new Error(body.error ?? "Something went wrong. Please try again.");
  return body;
}
export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const data = await api<{ user: SafeUser | null }>("session");
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);
  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ user, loading, refresh }}>
        {children}
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
export const useAuth = () => useContext(AuthContext);

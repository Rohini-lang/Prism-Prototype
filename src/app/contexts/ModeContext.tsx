import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Role = "dev" | "user";

interface ModeContextValue {
  mode: Role;
  isDev: boolean;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Role>("dev");

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "dev" ? "user" : "dev"));
  }, []);

  return (
    <ModeContext.Provider value={{ mode, isDev: mode === "dev", toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within a ModeProvider");
  return ctx;
}

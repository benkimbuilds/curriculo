"use client";

import { createContext, useContext, type ReactNode } from "react";

// Solo datos de presentación. La autorización real vive en el servidor
// (layout (app), getCurrentSession y requirePermission en cada página y acción).
export type AppSessionView = {
  userName: string;
  roleLabel: string;
  showProfile: boolean;
};

const AppSessionContext = createContext<AppSessionView | null>(null);

export function AppSessionProvider({
  value,
  children,
}: {
  value: AppSessionView;
  children: ReactNode;
}) {
  return <AppSessionContext.Provider value={value}>{children}</AppSessionContext.Provider>;
}

export function useAppSession(): AppSessionView {
  const ctx = useContext(AppSessionContext);
  if (!ctx) throw new Error("useAppSession must be used within AppSessionProvider");
  return ctx;
}

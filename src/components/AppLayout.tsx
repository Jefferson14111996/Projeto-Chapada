import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppLayout({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 border-b border-border bg-card/60 backdrop-blur-sm flex items-center px-4 md:px-8 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl font-display font-semibold truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 border border-border w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar..."
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
            />
          </div>
          <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-muted transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-terracotta" />
          </button>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              MC
            </AvatarFallback>
          </Avatar>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">
          {actions && <div className="flex flex-wrap gap-3 mb-6 justify-end">{actions}</div>}
          {children}
        </main>
      </div>
    </div>
  );
}

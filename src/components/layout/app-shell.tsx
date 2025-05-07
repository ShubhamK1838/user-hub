
import type { ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";
import { MainNav } from "./main-nav";
import { AppLogoText } from "@/components/icons/logo";
import Link from "next/link";
import { getCurrentUser } from "@/lib/users"; // For fetching current user
import { APP_NAME } from "@/lib/constants";
import { Toaster } from "@/components/ui/toaster";

export default async function AppShell({ children }: { children: ReactNode }) {
  const currentUser = await getCurrentUser(); // Fetch current user data

  return (
    <SidebarProvider defaultOpen={true} open={true}>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <AppLogoText />
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <ScrollArea className="h-full">
            <MainNav currentUser={currentUser} />
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-2 mt-auto">
          {/* Footer content if any, e.g. version number */}
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-app-content-background text-app-content-foreground">
        <header className="sticky top-0 z-40 w-full border-b bg-background backdrop-blur-sm">
          <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
            <div className="flex gap-6 md:gap-10">
              <SidebarTrigger className="hidden md:flex" />
              {/* Add breadcrumbs or page title here if needed */}
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <UserNav user={currentUser} />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}

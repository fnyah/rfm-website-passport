"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

const noop = () => {};

/**
 * The admin frame: sidebar on the left, the page on the right. On desktop the
 * sidebar is pinned open; the shared Sidebar would otherwise hide itself on
 * ⌘B / Ctrl+B, the same keys as "Bold" in the text editor. Below 768px it
 * folds into a "Menu" button.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      open
      onOpenChange={noop}
      className="admin-ui"
      style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
    >
      <AdminSidebar />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4 md:hidden">
          <MenuButton />
          <p className="font-heading text-xl font-medium">Your website</p>
        </header>
        <main className="flex-1 px-5 py-8 sm:px-8 md:px-12 md:py-14">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function MenuButton() {
  const { setOpenMobile } = useSidebar();
  return (
    <Button variant="outline" size="xl" className="px-4" onClick={() => setOpenMobile(true)}>
      <Menu aria-hidden />
      Menu
    </Button>
  );
}

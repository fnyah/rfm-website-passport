"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ADMIN_NAV_LINKS, activeNavHref } from "@/components/admin/admin-nav-links";
import { signOutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const itemClass =
  "h-auto min-h-13 gap-3 rounded-lg px-3 py-3 text-lg [&_svg]:size-6 focus-visible:ring-3 focus-visible:ring-sidebar-ring data-active:bg-sidebar-primary data-active:font-semibold data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground";

export function AdminSidebar() {
  const pathname = usePathname();
  const active = activeNavHref(pathname);
  const { setOpenMobile } = useSidebar();
  const close = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="px-5 pt-6 pb-4">
        <p className="font-heading text-3xl font-medium">Your website</p>
        <p className="text-lg text-muted-foreground">Choose what to change</p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {ADMIN_NAV_LINKS.map((link) => {
                const sub = "sub" in link && link.sub;
                return (
                  <SidebarMenuItem key={link.href} className={cn(sub && "ml-6")}>
                    <SidebarMenuButton
                      isActive={active === link.href}
                      render={<Link href={link.href} onClick={close} />}
                      className={cn(itemClass, sub && "[&_svg]:size-5")}
                    >
                      <link.icon aria-hidden />
                      <span>{link.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-3 py-4">
        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<a href="/" target="_blank" rel="noreferrer" />}
              className={itemClass}
            >
              <ExternalLink aria-hidden />
              <span>See my website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={signOutAction}>
              <SidebarMenuButton type="submit" className={itemClass}>
                <LogOut aria-hidden />
                <span>Sign out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

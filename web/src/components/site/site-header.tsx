"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink } from "@/components/site/nav-link";
import { SITE_NAV_LINKS } from "@/components/site/nav-links";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur supports-backdrop-blur:bg-background/70">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-medium tracking-tight"
        >
          Dr. Rose Fine-Meyer
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {SITE_NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle className="font-heading">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-6 px-4">
              {SITE_NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  className="text-base"
                  onNavigate={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

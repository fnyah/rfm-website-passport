import { Home, Images, User, CalendarDays, FolderOpen, GraduationCap } from "lucide-react";

/**
 * The admin sidebar, in the order the pages appear on the public site.
 * `sub` items are separate pages that belong to the section above them.
 */
export const ADMIN_NAV_LINKS = [
  { href: "/admin/home", label: "Home page", icon: Home },
  { href: "/admin/home/photos", label: "Home page photos", icon: Images, sub: true },
  { href: "/admin/about", label: "About me", icon: User },
  { href: "/admin/about/events", label: "Upcoming events", icon: CalendarDays, sub: true },
  { href: "/admin/projects", label: "Student projects", icon: FolderOpen },
  { href: "/admin/for-educators", label: "For educators", icon: GraduationCap },
] as const;

/** The link whose page you're on: the longest href the path starts with. */
export function activeNavHref(pathname: string) {
  return ADMIN_NAV_LINKS.map((link) => link.href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];
}

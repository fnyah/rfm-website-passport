import { Home, Info, FolderKanban, GraduationCap } from "lucide-react";

export const ADMIN_NAV_LINKS = [
  {
    href: "/admin/home",
    label: "Home Page",
    description: "Intro text and the homepage photo banner",
    icon: Home,
  },
  {
    href: "/admin/about",
    label: "About Page",
    description: "Your bio, standings, and upcoming events",
    icon: Info,
  },
  {
    href: "/admin/projects",
    label: "Student Projects",
    description: "Projects on the Projects page",
    icon: FolderKanban,
  },
  {
    href: "/admin/for-educators",
    label: "For Educators",
    description: "Resource posts on the For Educators page",
    icon: GraduationCap,
  },
] as const;


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Settings,
  ShieldCheck,
  FileText,
  LifeBuoy,
  MessageSquare,
  Bell,
  Contact,
  GitBranch,
  Users2,
  BrainCircuit
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  subItems?: NavItem[];
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "User Management", icon: Users },
  { 
    href: "/roles", 
    label: "Role Management", 
    icon: ShieldCheck, 
    adminOnly: true,
    subItems: [
      { href: "/roles/suggest", label: "AI Role Suggestion", icon: BrainCircuit }
    ]
  },
  { href: "/profile", label: "My Profile", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/audit-logs", label: "Audit Logs", icon: FileText, adminOnly: true },
  { href: "/notifications", label: "Notifications", icon: Bell },
  {
    href: "#",
    label: "Help & Support",
    icon: LifeBuoy,
    subItems: [
      { href: "/help", label: "Help Documentation", icon: FileText },
      { href: "/feedback", label: "Feedback", icon: MessageSquare },
      { href: "/contact-support", label: "Contact Support", icon: Contact },
      { href: "/terms-privacy", label: "Terms & Privacy", icon: GitBranch },
    ],
  },
];

interface MainNavProps {
  currentUser?: User | null;
}

export function MainNav({ currentUser }: MainNavProps) {
  const pathname = usePathname();
  const isAdmin = currentUser?.roles.includes("ROLE_ADMIN");

  const renderNavItem = (item: NavItem, isSubItem: boolean = false) => {
    if (item.adminOnly && !isAdmin) {
      return null;
    }

    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
    const ButtonComponent = isSubItem ? SidebarMenuSubButton : SidebarMenuButton;
    const ItemComponent = isSubItem ? SidebarMenuSubItem : SidebarMenuItem;

    return (
      <ItemComponent key={item.href}>
        <ButtonComponent
          asChild={!item.subItems}
          href={item.subItems ? undefined : item.href}
          className={cn(
            "w-full justify-start",
            isActive && !isSubItem && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
            isActive && isSubItem && "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90"
          )}
          isActive={isActive}
          tooltip={item.label}
        >
          {item.subItems ? (
            <>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </>
          ) : (
            <Link href={item.href} className="flex items-center gap-2 w-full">
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )}
        </ButtonComponent>
        {item.subItems && item.subItems.length > 0 && (
          <SidebarMenuSub>
            {item.subItems.map((subItem) => renderNavItem(subItem, true))}
          </SidebarMenuSub>
        )}
      </ItemComponent>
    );
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => renderNavItem(item))}
    </SidebarMenu>
  );
}

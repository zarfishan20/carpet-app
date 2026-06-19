"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCheck,
  ClipboardCheck,
  FileText,
  FileSpreadsheet,
  Receipt,
  Settings,
} from "lucide-react";

type Role = "admin" | "fitter";

export default function Sidebar({ role }: { role: Role }) {
      const supabase = createClient();
  const [isOpen] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);
      const [name, setName] = useState<string>("U");
  const pathname = usePathname();

  const adminLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
    { name: "Projects", icon: Briefcase, path: "/dashboard/admin/projects" },
    { name: "Customers", icon: Users, path: "/dashboard/admin/customers" },
    { name: "Fitters", icon: UserCheck, path: "/dashboard/admin/fitters" },
    { name: "Surveys", icon: ClipboardCheck, path: "/dashboard/admin/surveys" },
    { name: "Quotes", icon: FileText, path: "/dashboard/admin/quotes" },
    { name: "Jobsheets", icon: FileSpreadsheet, path: "/dashboard/admin/jobsheets" },
    { name: "Invoices", icon: Receipt, path: "/dashboard/admin/invoices" },
    { name: "Settings", icon: Settings, path: "/dashboard/admin/settings" },
  ];

  const fitterLinks = [
    { name: "My Jobs", icon: Briefcase, path: "/dashboard/fitter" },
    { name: "Surveys", icon: ClipboardCheck, path: "/dashboard/fitter/surveys" },
    { name: "Jobsheets", icon: FileSpreadsheet, path: "/dashboard/fitter/jobsheets" },
  ];

  const menuItems = role === "admin" ? adminLinks : fitterLinks;
    useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      const fullName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email ||
        "User";

      setName(fullName[0].toUpperCase());

      setAvatar(user?.user_metadata?.avatar_url || null);
    }

    loadUser();
  }, [supabase]);

  return (
    <aside className="w-16 md:w-64 bg-slate-900 text-white border-r border-slate-800 min-h-full">

      {/* PROFILE AREA (replaces logo) */}
      <div className="h-16 flex items-center justify-center md:justify-start md:px-4 border-b border-slate-800">
        
      {avatar ? (
  <Image
    src={avatar}
    alt="Profile"
    width={36}
    height={36}
    className="rounded-full object-cover"
  />
) : (
  <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold">
    {name}
  </div>
)}

        {/* Name only on desktop */}
        <span className="hidden md:block ml-3 font-bold text-sm">
          My Account
        </span>
      </div>

      {/* Menu */}
      <nav className="p-2 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition
                justify-center md:justify-start
                ${isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800/60 text-slate-300"}
              `}
            >
              <Icon size={20} />
              <span className="hidden md:inline text-sm">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
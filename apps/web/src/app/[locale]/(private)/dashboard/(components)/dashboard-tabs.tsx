"use client";

import { Camera, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function DashboardTabs() {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();

  const tabs = [
    {
      href: "/dashboard",
      label: "my_albums",
      icon: Camera,
    },
    {
      href: "/dashboard/chat",
      label: "chat",
      icon: MessageSquare,
    },
  ] as const;

  return (
    <div className="mb-10 inline-flex gap-2 self-start rounded-2xl border border-background/60 bg-background/40 p-1.5 shadow-sm backdrop-blur-md">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-2.5 font-semibold text-sm shadow-sm transition-all duration-300",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-text hover:bg-white/60 hover:text-slate-900"
            )}
            href={tab.href}
            key={tab.href}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {t(tab.label)}
          </Link>
        );
      })}
    </div>
  );
}

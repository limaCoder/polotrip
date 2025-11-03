"use client";

import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useHeaderDashboardContent } from "./useHeaderDashboardContent";

export function DashboardContent() {
  const t = useTranslations("Header");
  const headerContent = useHeaderDashboardContent();

  if (!headerContent) return null;

  const { userData, handleLogout } = headerContent;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("open_user_menu_aria")}
        className="flex items-center gap-2"
      >
        <Avatar>
          {userData?.userAvatar || userData?.usernameInitials ? (
            <>
              <AvatarImage
                referrerPolicy="no-referrer"
                src={userData?.userAvatar}
              />
              <AvatarFallback className="bg-primary font-bold text-white">
                {userData?.usernameInitials}
              </AvatarFallback>
            </>
          ) : (
            <Skeleton className="h-12 w-12 rounded-full" />
          )}
        </Avatar>
        <ChevronDownIcon className="h-4 w-4 text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background">
        <DropdownMenuLabel className="cursor-pointer transition-colors duration-200 hover:bg-primary/10">
          {t("my_account")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer transition-colors duration-200 hover:bg-primary/10"
          onClick={handleLogout}
        >
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDownIcon } from 'lucide-react';
import { useHeaderDashboardContent } from './useHeaderDashboardContent';
import { useTranslations } from 'next-intl';

export function DashboardContent() {
  const t = useTranslations('Header');
  const headerContent = useHeaderDashboardContent();

  if (!headerContent) return null;

  const { userData, handleLogout } = headerContent;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2"
          aria-label={t('open_user_menu_aria')}
        >
          <Avatar>
            {userData?.userAvatar || userData?.usernameInitials ? (
              <>
                <AvatarImage referrerPolicy="no-referrer" src={userData?.userAvatar} />
                <AvatarFallback className="bg-primary font-bold text-white">
                  {userData?.usernameInitials}
                </AvatarFallback>
              </>
            ) : (
              <Skeleton className="h-12 w-12 rounded-full" />
            )}
          </Avatar>
          <ChevronDownIcon className="w-4 h-4 text-primary" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-background">
          <DropdownMenuLabel className="cursor-pointer hover:bg-primary/10 transition-colors duration-200">
            {t('my_account')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer hover:bg-primary/10 transition-colors duration-200"
            onClick={handleLogout}
          >
            {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

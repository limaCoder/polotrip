'use client';

import { useCallback, useEffect, useState } from 'react';
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
import { signOut, getSession } from '@/lib/auth/client';
import { usePathname, useRouter } from '@/i18n/routing';
import { UserDataState } from './types';
import { ChevronDownIcon } from 'lucide-react';

export function DashboardContent() {
  const [userData, setUserData] = useState<UserDataState>({
    userAvatar: undefined,
    userName: undefined,
    usernameInitials: undefined,
  });

  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === `/dashboard`;

  const getUserData = useCallback(async () => {
    const session = await getSession();

    const userAvatar = session?.data?.user?.image ?? undefined;
    const userName = session?.data?.user?.name ?? undefined;

    const usernameInitials = userName
      ?.split(' ')
      .map(name => name[0])
      .join('');

    setUserData({ userAvatar, userName, usernameInitials });
  }, []);

  async function handleLogout() {
    await signOut({});

    router.push('/sign-in');
  }

  useEffect(() => {
    if (!isDashboard) return;

    getUserData();
  }, [getUserData, isDashboard]);

  if (!isDashboard) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2" aria-label="Abrir menu de usuário">
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
            Minha conta
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer hover:bg-primary/10 transition-colors duration-200"
            onClick={handleLogout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut, getSession } from '@/lib/auth/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export function DashboardContent() {
  const router = useRouter();

  const [userData, setUserData] = useState<{
    userAvatar: string | undefined;
    userName: string | undefined;
    usernameInitials: string | undefined;
  }>({
    userAvatar: undefined,
    userName: undefined,
    usernameInitials: undefined,
  });

  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale;

  const getUserData = useCallback(async () => {
    const session = await getSession();

    const userAvatar = session?.data?.user?.image ?? undefined;
    const userName = session?.data?.user?.name ?? undefined;

    console.log(userAvatar);

    const usernameInitials = userName
      ?.split(' ')
      .map(name => name[0])
      .join('');

    setUserData({ userAvatar, userName, usernameInitials });
  }, []);

  async function handleLogout() {
    await signOut({});

    router.push(`/${locale}/sign-in`);
  }

  const isDashboard = pathname === `/${locale}/dashboard`;

  useEffect(() => {
    if (!isDashboard) return;

    getUserData();
  }, [getUserData, isDashboard]);

  if (!isDashboard) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            {userData?.userAvatar && userData?.usernameInitials ? (
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
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
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

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { getSession, signOut } from "@/lib/auth/client";
import type { UserDataState } from "./types";

export function useHeaderDashboardContent() {
  const [userData, setUserData] = useState<UserDataState>({
    userAvatar: undefined,
    userName: undefined,
    usernameInitials: undefined,
  });

  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  const getUserData = useCallback(async () => {
    const session = await getSession();

    const userAvatar = session?.data?.user?.image ?? undefined;
    const userName = session?.data?.user?.name ?? undefined;

    const usernameInitials = userName
      ?.split(" ")
      .map((name) => name[0])
      .join("");

    setUserData({ userAvatar, userName, usernameInitials });
  }, []);

  async function handleLogout() {
    await signOut({});

    router.push("/sign-in");
  }

  useEffect(() => {
    if (!isDashboard) return;

    getUserData();
  }, [getUserData, isDashboard]);

  if (!isDashboard) return null;

  return { userData, handleLogout };
}

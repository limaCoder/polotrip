import { useCallback, useEffect, useState } from "react";
import { getSession } from "@/lib/auth/client";

type UserData = {
  userAvatar: string | undefined;
  userName: string | undefined;
  usernameInitials: string | undefined;
};

let cachedUserData: UserData | null = null;
let isLoading = false;
const listeners = new Set<(data: UserData) => void>();

async function fetchUserData(): Promise<UserData> {
  if (cachedUserData) {
    return cachedUserData;
  }

  if (isLoading) {
    return new Promise((resolve) => {
      const listener = (data: UserData) => {
        listeners.delete(listener);
        resolve(data);
      };
      listeners.add(listener);
    });
  }

  isLoading = true;

  try {
    const session = await getSession();
    const userAvatar = session?.data?.user?.image ?? undefined;
    const userName = session?.data?.user?.name ?? undefined;

    const usernameInitials = userName
      ?.split(" ")
      .map((name) => name[0])
      .join("");

    const userData: UserData = {
      userAvatar,
      userName,
      usernameInitials,
    };

    cachedUserData = userData;

    for (const listener of listeners) {
      listener(userData);
    }

    listeners.clear();

    return userData;
  } finally {
    isLoading = false;
  }
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData>(
    cachedUserData ?? {
      userAvatar: undefined,
      userName: undefined,
      usernameInitials: undefined,
    }
  );

  const loadUserData = useCallback(async () => {
    const data = await fetchUserData();
    setUserData(data);
  }, []);

  useEffect(() => {
    if (cachedUserData) {
      setUserData(cachedUserData);
    } else {
      loadUserData();
    }
  }, [loadUserData]);

  return userData;
}

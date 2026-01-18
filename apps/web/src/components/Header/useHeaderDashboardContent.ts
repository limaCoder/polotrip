import { useUserData } from "@/hooks/use-user-data";
import { usePathname, useRouter } from "@/i18n/routing";
import { signOut } from "@/lib/auth/client";

export function useHeaderDashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const userData = useUserData();

  async function handleLogout() {
    await signOut({});

    router.push("/sign-in");
  }

  if (!isDashboard) return null;

  return { userData, handleLogout };
}

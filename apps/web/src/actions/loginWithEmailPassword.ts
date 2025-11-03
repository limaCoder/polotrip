import { auth } from "@polotrip/auth";
import { redirect } from "@/i18n/routing";

export async function loginWithEmailPassword(
  locale: string,
  formData: FormData
) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!(email && password)) {
    throw new Error("Email and password are required");
  }

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Error when logging in");
  }

  redirect({ href: "/dashboard", locale });
}

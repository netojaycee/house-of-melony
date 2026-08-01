"use server";

import { headers } from "next/headers";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { checkRateLimit } from "@/lib/rate-limit";

export type LoginState = { status: "idle" } | { status: "error"; message: string };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { success } = await checkRateLimit(`login:${ip}`);
  if (!success) {
    return {
      status: "error",
      message: "Too many attempts. Please wait a moment and try again.",
    };
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return { status: "idle" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { status: "error", message: "Invalid email or password." };
    }
    throw error;
  }
}

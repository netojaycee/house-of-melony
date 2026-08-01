"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export type LoginState = { status: "idle" } | { status: "error"; message: string };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
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

"use server";
import { z } from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const ValidatedData = LoginSchema.safeParse(values);

  if (!ValidatedData.success) {
    return { error: "Invalid Credentials, try again later" };
  }
 
  const { email, password } = ValidatedData.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };
        default:
          return { error: "An error occurred, try again later" };
      }
    }
    throw error;
  }
};

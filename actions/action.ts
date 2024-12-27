"use server";

import prisma from "@/lib/db";
import { userSchema } from "@/zod/userSchema";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import argon2 from "argon2";
export const handleLoginAction = async (
  prevState: unknown,
  formData: FormData,
) => {
  const rawFormData = Object.fromEntries(formData);
  const validationResult = userSchema.safeParse(rawFormData);

  let errors: { [key: string]: string[] } = {};

  if (!validationResult.success) {
    errors = validationResult.error.flatten().fieldErrors;
    return { success: false, errors, values: rawFormData };
  }

  const { fullName, email, password, phoneNumber } = validationResult.data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      errors.email = ["This email is already registered"];
    }
    if (existingUser.phoneNumber === phoneNumber) {
      errors.phoneNumber = ["This phone number is already registered"];
    }
    return { success: false, errors, values: rawFormData };
  }
  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
  });
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
    },
  });

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });

  redirect("/");
};

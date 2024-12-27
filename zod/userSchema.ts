import { z } from "zod";
export const userSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full name is required" })
    .min(3, { message: "Full name must be at least 3 characters long" })
    .max(50, { message: "Full name must not exceed 50 characters" })
    .trim(),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128, { message: "Password must not exceed 128 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).*$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),

  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[6-9]\d{9}$/, {
      message:
        "Phone number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9",
    }),
});

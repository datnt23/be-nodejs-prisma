import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must have at least 8 characters"),
});

const signUpSchema = z.object({
  email: z.string({ message: "Email is required" }).email("Invalid email"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must have at least 8 characters"),
  firstName: z
    .string({ message: "First name is required" })
    .min(1, "Cannot be empty"),
  lastName: z
    .string({ message: "Last name is required" })
    .min(1, "Cannot be empty"),
});

export { loginSchema, signUpSchema };

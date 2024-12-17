import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ message: "Password is required" })
    .min(6, "Password must have at least 6 characters"),
});

const registerSchema = z
  .object({
    email: z.string({ message: "Email is required" }).email("Invalid email"),
    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must have at least 6 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain special characters"
      ),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .min(6, "Confirm password must have at least 6 characters")
      .regex(/[A-Z]/, "Confirm password must contain an uppercase letter")
      .regex(/[0-9]/, "Confirm password must contain a number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Confirm password must contain special characters"
      ),
    firstName: z
      .string({ message: "First name is required" })
      .min(1, "Cannot be empty"),
    lastName: z
      .string({ message: "Last name is required" })
      .min(1, "Cannot be empty"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

export { loginSchema, registerSchema };

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const chatMessageSchema = z.object({
  text: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message too long"),
  username: z
    .string()
    .min(1, "Username required")
    .max(30, "Username too long"),
});

export type ChatMessageData = z.infer<typeof chatMessageSchema>;

export const guestNameSchema = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be 20 characters or less")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, dashes and underscores"
    ),
});

export type GuestNameData = z.infer<typeof guestNameSchema>;

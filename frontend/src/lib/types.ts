import { z } from "zod";

export type Filter = "all" | "completed" | "uncompleted";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export type PaginatedResult<T> = {
  data: T[];
  last: number;
  page: number;
  size: number;
  total: number;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
};

export type Auth = {
  userId: number;
  username: string;
  token: string;
  role: Role;
};

export type User = {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
  tasks?: Task[];
};

export type PaginationOption = { text: string; value: number };

export type ErrorResponse = {
  message: string;
  statusCode: number;
};

export const LoginFormSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(5, "Username must be at least 5 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const RegisterFormSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(5, "Username must be at least 5 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    retypedPassword: z
      .string()
      .min(1, "Retyped password is required")
      .min(8, "Retyped password must be at least 8 characters"),
    firstName: z
      .string()
      .min(1, "Firstname is required")
      .min(2, "Firstname must be at least 2 characters"),
    lastName: z
      .string()
      .min(1, "Lastname is required")
      .min(2, "Lastname must be at least 2 characters"),
    email: z.string().email().min(1, "Email is required"),
  })
  .refine((data) => data.password === data.retypedPassword, {
    message: "Passwords don't match",
    path: ["retypedPassword"],
  });

export const TaskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(5, "Description must be at least 5 characters"),
});

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
export type LoginFormValues = z.infer<typeof LoginFormSchema>;
export type TaskFormValues = z.infer<typeof TaskFormSchema>;

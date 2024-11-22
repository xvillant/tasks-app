import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { Auth, Filter, Role, Task } from "@/lib/types";
import { FILTER_VALUES } from "@/lib/constants";
import { createParser } from "nuqs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, "dd-MM-yyyy HH:mm");
}

type Permission = (typeof ROLES)[Role][number];
const ROLES = {
  ADMIN: [
    "view:tasks",
    "create:tasks",
    "edit:tasks",
    "complete:tasks",
    "delete:tasks",
  ],
  USER: ["view:tasks", "create:tasks", "edit:tasks", "complete:tasks"],
} as const;

export function hasPermission(
  user: Auth | null,
  permission: Permission,
  task: Task
) {
  if (!user) {
    return false;
  }

  if (!isTaskOwner(user, task) && !isAdmin(user)) {
    return false;
  }

  return (ROLES[user.role] as readonly Permission[]).includes(permission);
}

export function isAdmin(user: Auth | null) {
  if (!user) {
    return false;
  }

  return user.role === Role.ADMIN;
}

export function isTaskOwner(user: Auth | null, task: Task) {
  if (!user) {
    return false;
  }

  return user.userId === task.user.id;
}

export const parseAsFilter = createParser({
  parse(queryValue) {
    if (!FILTER_VALUES.includes(queryValue as Filter)) {
      return null;
    }

    return queryValue as Filter;
  },
  serialize(value: Filter) {
    return value;
  },
});

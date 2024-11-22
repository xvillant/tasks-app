import {
  ErrorResponse,
  PaginatedResult,
  TaskFormSchema,
  TaskFormValues,
  Task,
} from "@/lib/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";
import { queryClient } from "@/main";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useLocation, useSearchParams } from "react-router-dom";
import { PAGINATION_FIRST_PAGE, PAGINATION_LIMIT } from "@/lib/constants";
import { useUserStore } from "@/store/userStore";

type TaskFormProps = {
  task?: Task;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
};

export default function TaskForm({
  task,
  buttonVariant = "default",
}: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const user = useUserStore((state) => state.user);
  const { pathname } = useLocation();
  const isProfile = pathname.startsWith("/profile");

  const page = parseInt(
    searchParams.get("page") || PAGINATION_FIRST_PAGE.toString()
  );
  const pageSize = parseInt(
    searchParams.get("size") || PAGINATION_LIMIT.toString()
  );
  const filter = searchParams.get("filter") || "all";

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: task ? task.title : "",
      description: task ? task.description : "",
    },
  });

  const mutation = useMutation({
    mutationKey: ["create-edit-task"],
    mutationFn: async (data: TaskFormValues) => {
      let response;
      if (task) {
        response = await axiosClient.patch<Task>(`/tasks/${task.id}`, data);
      } else {
        response = await axiosClient.post<Task>("/tasks/", data);
      }
      return response.data;
    },
    onMutate: (data: TaskFormValues) => {
      if (user && isProfile) {
        const { username } = user;

        queryClient.cancelQueries({
          queryKey: ["tasks", { username }],
        });

        const previousTasks = queryClient.getQueryData<Task[]>([
          "tasks",
          { username },
        ]);

        queryClient.setQueryData(
          ["tasks", { username }],
          (old: Task[] | undefined) => {
            if (!old || !user || !task) return old;

            const updatedTasks = old.map((t) =>
              t.id === task.id ? { ...t, ...data } : t
            );

            return updatedTasks;
          }
        );
        return { previousTasks };
      } else {
        queryClient.cancelQueries({
          queryKey: ["tasks", { page, pageSize, filter }],
        });

        const previousTasks = queryClient.getQueryData<PaginatedResult<Task>>([
          "tasks",
          { page, pageSize, filter },
        ]);

        queryClient.setQueryData(
          ["tasks", { page, pageSize, filter }],
          (old: PaginatedResult<Task> | undefined) => {
            if (!old || !user) return old;

            let updatedTasks;

            if (task) {
              updatedTasks = old.data.map((t) =>
                t.id === task.id ? { ...t, ...data } : t
              );
            } else {
              const newTask: Task = {
                id: "optimistic-temp-id", // temporary ID for the optimistic update
                title: data.title,
                description: data.description,
                completed: false,
                completedAt: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                user: {
                  id: user.userId,
                  username: user.username,
                  role: user.role,
                },
              };
              updatedTasks = [...old.data, newTask];
            }

            const newTotal = old.total + 1;
            const newLast = Math.max(Math.ceil(newTotal / old.size) - 1, 0);

            return {
              ...old,
              total: newTotal,
              last: newLast,
              data: updatedTasks,
            };
          }
        );
        return { previousTasks };
      }
    },
    onError: (error: AxiosError<ErrorResponse>, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasks", { page, pageSize, filter }],
          context.previousTasks
        );
      }
      toast({
        title: error.response?.data.message || "An error occurred",
        variant: "destructive",
      });
    },
    onSuccess: (data: Task) => {
      queryClient.setQueryData(
        ["tasks", { page, pageSize, filter }],
        (old: PaginatedResult<Task> | undefined) => {
          if (!old) return old;

          const updatedTasks = old.data.map((task) => {
            if (task.id === "optimistic-temp-id") {
              // Replace the temporary ID with the real ID after server response
              return { ...task, ...data, id: data.id };
            }
            return task;
          });

          return {
            ...old,
            data: updatedTasks,
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["tasks", { page, pageSize, filter }],
      });

      setOpen(false);
      toast({
        title: task
          ? "Successfully updated the task"
          : "Successfully created a task",
      });
      form.reset();
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant={buttonVariant}>
          {task ? "Edit task" : "Create task"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{task ? "Edit task" : "Create task"}</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="md:gap-0 gap-2">
              <Button type="submit">{task ? "Edit" : "Create"}</Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

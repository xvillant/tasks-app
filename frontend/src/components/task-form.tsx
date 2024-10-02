import {
  ErrorResponse,
  TaskFormSchema,
  TaskFormValues,
  TaskResponse,
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

type TaskFormProps = {
  task?: TaskResponse;
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
        response = await axiosClient.patch<TaskResponse>(
          `/tasks/${task.id}`,
          data
        );
      } else {
        response = await axiosClient.post<TaskResponse>("/tasks/", data);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setOpen(false);
      toast({
        title: task
          ? "Successfully updated the task"
          : "Successfully created a task",
      });
      form.reset();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: error.response?.data.message || "An error occurred",
        variant: "destructive",
      });
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

            <DialogFooter className="sm:justify-start">
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

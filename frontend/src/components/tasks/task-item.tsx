import { ErrorResponse, PaginatedResult, Task } from "@/lib/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, X } from "lucide-react";
import { formatDate, hasPermission, isAdmin, isTaskOwner } from "@/lib/utils";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/main";
import axiosClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import TaskForm from "@/components/tasks/task-form";
import DeleteActionAlert from "@/components/tasks/delete-action-alert";
import { Link, useLocation } from "react-router-dom";
import { P, SPAN } from "@/components/typography";
import useSearchParams from "@/hooks/useSearchParams";

export default function TaskItem({ task }: { task: Task }) {
  const user = useUserStore((state) => state.user);
  const { pathname } = useLocation();
  const { page, pageSize, filter } = useSearchParams();
  const [openAlert, setOpenAlert] = useState(false);

  const isProfile = pathname.startsWith("/profile");

  const deleteMutation = useMutation({
    mutationKey: ["delete", task.id],
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(`/tasks/${id}`);
      return response.data;
    },
    onMutate: (id: string) => {
      if (isProfile && user) {
        const { username } = user;
        queryClient.cancelQueries({ queryKey: ["tasks", { username }] });
        const previousTasks = queryClient.getQueryData<Task[]>([
          "tasks",
          { username },
        ]);

        queryClient.setQueryData(
          ["tasks", { username }],
          (old: Task[] | undefined) => {
            if (!old) return old;

            const updatedTasks = old.filter((task) => task.id !== id);

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
            if (!old) return old;

            const updatedTasks = old.data.filter((task) => task.id !== id);

            const newTotal = old.total - 1;
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
      toast({ title: error.message, variant: "destructive" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", { page, pageSize, filter }],
      });
      toast({ title: "Successfully deleted task" });
    },
  });

  const completeMutation = useMutation({
    mutationKey: ["complete", task.id],
    mutationFn: async (id: string) => {
      await axiosClient.patch(`/tasks/${id}/complete`);
    },
    onMutate: (id: string) => {
      if (isProfile && user) {
        const { username } = user;
        queryClient.cancelQueries({ queryKey: ["tasks", { username }] });

        const previousTasks = queryClient.getQueryData<Task[]>([
          "tasks",
          { username },
        ]);

        queryClient.setQueryData(
          ["tasks", { username }],
          (old: Task[] | undefined) => {
            if (!old) return old;

            const updatedTasks = old.map((task) =>
              task.id === id
                ? {
                    ...task,
                    completed: !task.completed,
                    completedAt: new Date().toISOString(),
                  }
                : task
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
            if (!old) return old;

            const updatedTasks = old.data.map((task) =>
              task.id === id
                ? {
                    ...task,
                    completed: !task.completed,
                    completedAt: new Date().toISOString(),
                  }
                : task
            );

            return {
              ...old,
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
      toast({ title: error.message, variant: "destructive" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", { page, pageSize, filter }],
      });
    },
  });

  function TaskControls() {
    return (
      <div className="flex flex-col gap-1">
        {(isAdmin(user) || isTaskOwner(user, task)) && (
          <div className="flex items-center gap-2">
            {hasPermission(user, "complete:tasks", task) && (
              <Button onClick={() => completeMutation.mutate(task.id)}>
                {task.completed ? "Uncomplete" : "Complete"}
              </Button>
            )}
            {hasPermission(user, "edit:tasks", task) && (
              <TaskForm buttonVariant="outline" task={task} />
            )}
            {hasPermission(user, "delete:tasks", task) && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setOpenAlert(true)}
                >
                  Delete
                </Button>
                <DeleteActionAlert
                  open={openAlert}
                  setOpen={setOpenAlert}
                  onDelete={() => deleteMutation.mutate(task.id)}
                />
              </>
            )}
          </div>
        )}
        {task.completed && task.completedAt !== null && (
          <SPAN>{`Completed: ${formatDate(task.completedAt)}`}</SPAN>
        )}
      </div>
    );
  }

  return (
    <AccordionItem key={task.id} value={task.id}>
      <AccordionTrigger>
        <div className="flex items-center gap-2">
          {task.completed ? (
            <Check className="text-green-600" />
          ) : (
            <X className="text-destructive" />
          )}
          <P className="font-bold">{task.title}</P>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <P className="font-semibold">{formatDate(task.createdAt)}</P>
              <P>{task.description}</P>
            </div>
            <TaskControls />
          </div>
          <P className="font-semibold">
            Created by{" "}
            <Link
              className="text-primary hover:underline"
              to={`/profile/${task.user.username}`}
            >
              {task.user.username}
            </Link>
          </P>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

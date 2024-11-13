import { ErrorResponse, Role, TaskResponse } from "@/lib/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/main";
import axiosClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { Button } from "./ui/button";
import TaskForm from "./task-form";
import DeleteActionAlert from "./delete-action-alert";
import { Link } from "react-router-dom";

export default function TaskItem({ task }: { task: TaskResponse }) {
  const user = useUserStore((state) => state.user);

  const [openAlert, setOpenAlert] = useState(false);

  const deleteMutation = useMutation({
    mutationKey: ["delete", task.id],
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(`/tasks/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Successfully deleted task" });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  const completeMutation = useMutation({
    mutationKey: ["complete", task.id],
    mutationFn: async (id: string) => {
      await axiosClient.patch(`/tasks/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  return (
    <AccordionItem key={task.id} value={task.id}>
      <AccordionTrigger>
        <div className="flex items-center gap-2">
          {task.completed ? (
            <Check className="text-green-600" />
          ) : (
            <X className="text-destructive" />
          )}
          <p className="font-bold">{task.title}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <p className="font-semibold">{formatDate(task.createdAt)}</p>
              <p>{task.description}</p>
            </div>
            <div className="flex flex-col gap-1">
              {user &&
                (user.role === Role.ADMIN || user.userId === task.user.id) && (
                  <div className="flex items-center gap-2">
                    <Button onClick={() => completeMutation.mutate(task.id)}>
                      {task.completed ? "Uncomplete" : "Complete"}
                    </Button>
                    <TaskForm buttonVariant="outline" task={task} />
                    {user.role === Role.ADMIN && (
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
                <p className="text-xs">{`Completed: ${formatDate(
                  task.completedAt
                )}`}</p>
              )}
            </div>
          </div>
          <p className="font-semibold">
            Created by{" "}
            <Link
              className="text-primary hover:underline"
              to={`/profile/${task.user.username}`}
            >
              {task.user.username}
            </Link>
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

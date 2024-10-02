import TaskItem from "@/components/task-item";
import { Accordion } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/lib/axios";
import { TaskResponse, UserResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const { id } = useParams();

  const {
    data: dataProfile,
    isPending: isPendingProfile,
    isError: isErrorProfile,
    error: errorProfile,
  } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const response = await axiosClient.get<UserResponse>(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const {
    data: dataTasks,
    isPending: isPendingTasks,
    isError: isErrorTasks,
    error: errorTasks,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axiosClient.get<TaskResponse[]>(
        `tasks/user/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });

  function ProfileTasks() {
    if (isPendingTasks) {
      return (
        <div className="grid place-items-center">
          <Loader className="size-8 animate-spin" />
        </div>
      );
    }

    if (isErrorTasks) {
      return (
        <div className="grid place-items-center">
          <h1>{errorTasks.message}</h1>
        </div>
      );
    }

    if (dataTasks.length <= 0) {
      return (
        <div className="grid place-items-center">
          <h1>No tasks available...</h1>
        </div>
      );
    }

    return (
      <Accordion type="single" collapsible>
        {dataTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </Accordion>
    );
  }

  if (isPendingProfile) {
    return (
      <div className="grid place-items-center">
        <Loader className="size-8 animate-spin" />
      </div>
    );
  }

  if (isErrorProfile) {
    return (
      <div className="grid place-items-center">
        <h1>{errorProfile.message}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h1>{dataProfile.username}</h1>
      <Separator className="my-4" />
      <ProfileTasks />
    </div>
  );
}

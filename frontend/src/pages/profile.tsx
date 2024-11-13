import { TasksSkeleton } from "@/components/skeletons";
import TaskItem from "@/components/task-item";
import { Accordion } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import axiosClient from "@/lib/axios";
import { TaskResponse, UserResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
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
      return <TasksSkeleton />;
    }

    if (isErrorTasks) {
      return <h1 className="text-center">{errorTasks.message}</h1>;
    }

    if (dataTasks.length <= 0) {
      return <h1 className="text-center">No tasks available...</h1>;
    }

    return (
      <Accordion type="single" collapsible>
        {dataTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </Accordion>
    );
  }

  function Profile() {
    if (isPendingProfile) {
      return <Skeleton className="h-4 w-full" />;
    }

    if (isErrorProfile) {
      return <h1 className="text-center">{errorProfile.message}</h1>;
    }

    return <h1>{dataProfile.username}</h1>;
  }

  return (
    <div className="flex flex-col">
      <Profile />
      <Separator className="my-4" />
      <ProfileTasks />
    </div>
  );
}

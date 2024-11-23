import ProfileChart from "@/components/profile/profile-chart";
import ProfileInfo from "@/components/profile/profile-info";
import TaskItem from "@/components/tasks/task-item";
import { H2 } from "@/components/typography";
import { Accordion } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/lib/axios";
import { Task, User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  ProfileInfoSkeleton,
  ProfileTasksSkeleton,
} from "@/components/profile/profile-skeletons";
import { parseAsFilter } from "@/lib/utils";
import FilteringButtons from "@/components/filtering-buttons";

export default function ProfilePage() {
  const { username } = useParams();
  const [filter, setFilter] = useQueryState(
    "filter",
    parseAsFilter.withDefault("all")
  );

  const {
    data: dataProfile,
    isPending: isPendingProfile,
    isError: isErrorProfile,
    error: errorProfile,
  } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const response = await axiosClient.get<User>(`/users/${username}`);
      return response.data;
    },
    enabled: !!username,
  });

  const {
    data: dataTasks,
    isPending: isPendingTasks,
    isError: isErrorTasks,
    error: errorTasks,
  } = useQuery({
    queryKey: ["tasks", { username }],
    queryFn: async () => {
      const response = await axiosClient.get<Task[]>(`tasks/user/${username}`);
      return response.data;
    },
    enabled: !!username,
  });

  const chartData = useMemo(() => {
    return [
      {
        status: `Status ${dataTasks?.length} of ${
          dataProfile?.username
        }'s task${dataTasks?.length === 1 ? "" : "s"}`,
        completed: dataTasks?.filter((task) => task.completed).length,
        uncompleted: dataTasks?.filter((task) => !task.completed).length,
      },
    ];
  }, [dataTasks, dataProfile]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "completed":
        return dataTasks?.filter((task) => task.completed);
      case "uncompleted":
        return dataTasks?.filter((task) => !task.completed);
      default:
        return dataTasks;
    }
  }, [filter, dataTasks]);

  function ProfileTasks() {
    if (isPendingTasks) {
      return <ProfileTasksSkeleton />;
    }

    if (isErrorTasks) {
      return <H2 className="text-center">{errorTasks.message}</H2>;
    }

    if (dataTasks.length <= 0) {
      <div className="flex flex-col gap-5">
        <H2 className="text-primary">{dataProfile?.username}'s tasks</H2>
        <H2 className="text-center">No tasks available...</H2>;
      </div>;
    }

    return (
      <div className="flex flex-col gap-5">
        <H2 className="text-primary">{dataProfile?.username}'s tasks</H2>
        <FilteringButtons onFilterChange={(value) => setFilter(value)} />
        {filteredTasks!.length <= 0 ? (
          <H2 className="text-center">No tasks available for this filter...</H2>
        ) : (
          <Accordion type="single" collapsible>
            {filteredTasks?.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </Accordion>
        )}
      </div>
    );
  }

  function Profile() {
    if (isPendingProfile) {
      return <ProfileInfoSkeleton />;
    }

    if (isErrorProfile) {
      return <H2 className="text-center">{errorProfile.message}</H2>;
    }

    return (
      <div className="flex flex-col md:flex-row gap-5">
        <ProfileInfo dataProfile={dataProfile} />
        <ProfileChart chartData={chartData} />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Profile />
      <Separator className="my-4" />
      <ProfileTasks />
    </div>
  );
}

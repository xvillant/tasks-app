import ProfileChart from "@/components/profile/profile-chart";
import ProfileInfo from "@/components/profile/profile-info";
import TaskItem from "@/components/tasks/task-item";
import { H2 } from "@/components/typography";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/lib/axios";
import { FILTER_VALUES } from "@/lib/constants";
import { Task, User, Filter } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { createParser, useQueryState } from "nuqs";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  ProfileInfoSkeleton,
  ProfileTasksSkeleton,
} from "@/components/profile/profile-skeletons";

const parseAsFilter = createParser({
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
        status: `Status ${dataTasks?.length} of my task${
          dataTasks?.length === 1 ? "" : "s"
        }`,
        completed: dataTasks?.filter((task) => task.completed).length,
        uncompleted: dataTasks?.filter((task) => !task.completed).length,
      },
    ];
  }, [dataTasks]);

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
        <H2 className="text-primary">My tasks</H2>
        <H2 className="text-center">No tasks available...</H2>;
      </div>;
    }

    return (
      <div className="flex flex-col gap-5">
        <H2 className="text-primary">My tasks</H2>
        <div className="flex items-center gap-2">
          <Button
            className={clsx({
              "bg-foreground text-background hover:bg-foreground/90":
                filter === "all",
            })}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            className={clsx({
              "bg-foreground text-background hover:bg-foreground/90":
                filter === "completed",
            })}
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
          <Button
            className={clsx({
              "bg-foreground text-background hover:bg-foreground/90":
                filter === "uncompleted",
            })}
            onClick={() => setFilter("uncompleted")}
          >
            Uncompleted
          </Button>
        </div>
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

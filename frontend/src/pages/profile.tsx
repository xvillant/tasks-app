import { TasksSkeleton } from "@/components/skeletons";
import TaskItem from "@/components/task-item";
import { H2 } from "@/components/typography";
import { Accordion } from "@/components/ui/accordion";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import axiosClient from "@/lib/axios";
import { TaskResponse, UserResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "#16a34a",
  },
  uncompleted: {
    label: "Uncompleted",
    color: "#7f1d1d",
  },
} satisfies ChartConfig;

export default function ProfilePage() {
  const { username } = useParams();

  const {
    data: dataProfile,
    isPending: isPendingProfile,
    isError: isErrorProfile,
    error: errorProfile,
  } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const response = await axiosClient.get<UserResponse>(
        `/users/${username}`
      );
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
      const response = await axiosClient.get<TaskResponse[]>(
        `tasks/user/${username}`
      );
      return response.data;
    },
    enabled: !!username,
  });

  const chartData = [
    {
      status: `Status ${dataTasks?.length} of my task${
        dataTasks?.length === 1 ? "" : "s"
      }`,
      completed: dataTasks?.filter((task) => task.completed).length,
      uncompleted: dataTasks?.filter((task) => !task.completed).length,
    },
  ];

  function ProfileTasks() {
    if (isPendingTasks) {
      return <TasksSkeleton />;
    }

    if (isErrorTasks) {
      return <H2 className="text-center">{errorTasks.message}</H2>;
    }

    if (dataTasks.length <= 0) {
      <div className="flex flex-col gap-5">
        <H2 className="text-primary">My tasks</H2>
        return <H2 className="text-center">No tasks available...</H2>;
      </div>;
    }

    return (
      <div className="flex flex-col gap-5">
        <H2 className="text-primary">My tasks</H2>
        <Accordion type="single" collapsible>
          {dataTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </Accordion>
      </div>
    );
  }

  function Profile() {
    if (isPendingProfile) {
      return <Skeleton className="h-4 w-full" />;
    }

    if (isErrorProfile) {
      return <H2 className="text-center">{errorProfile.message}</H2>;
    }

    return (
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col gap-5">
          <H2 className="text-primary">My profile</H2>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Username</TableCell>
                <TableCell className="text-right">
                  {dataProfile.username || ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Firstname</TableCell>
                <TableCell className="text-right">
                  {dataProfile.firstName || ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Lastname</TableCell>
                <TableCell className="text-right">
                  {dataProfile.lastName || ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Email</TableCell>
                <TableCell className="text-right">
                  {dataProfile.email || ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Role</TableCell>
                <TableCell className="text-right">{dataProfile.role}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Created</TableCell>
                <TableCell className="text-right">
                  {formatDate(dataProfile.createdAt || "")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="flex-1">
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="status"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="completed"
                fill="var(--color-completed)"
                radius={4}
              />
              <Bar
                dataKey="uncompleted"
                fill="var(--color-uncompleted)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </div>
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

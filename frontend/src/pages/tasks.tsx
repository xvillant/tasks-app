import TaskForm from "@/components/task-form";
import TasksList from "@/components/tasks-list";
import Pagination from "@/components/pagintaion";
import axiosClient from "@/lib/axios";
import { PAGINATION_FIRST_PAGE, PAGINATION_LIMIT } from "@/lib/constants";
import { PaginatedResult, TaskResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import PaginationSelect from "@/components/pagination-select";

export default function TasksPage() {
  const [page, setPage] = useState(PAGINATION_FIRST_PAGE);
  const [pageSize, setPageSize] = useState(PAGINATION_LIMIT.toString());

  const {
    data: tasks,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks", { page, pageSize }],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedResult<TaskResponse>>(
        `/tasks?size=${pageSize}&page=${page - 1}&sort=createdAt:desc`
      );
      return response.data;
    },
  });

  const incrementPage = () => {
    if (!tasks || tasks.last <= page - 1) {
      return;
    }
    setPage((prev) => prev + 1);
  };

  const decrementPage = () => {
    if (page - 1 < PAGINATION_FIRST_PAGE) {
      return;
    }
    setPage((prev) => prev - 1);
  };

  if (isError) {
    return (
      <div className="grid place-items-center">
        <h1>{error.message}</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <TaskForm />
      </div>
      {isPending ? (
        <div className="grid place-items-center">
          <Loader className="size-8 animate-spin" />
        </div>
      ) : (
        <>
          {tasks.total <= 0 ? (
            <div className="grid place-items-center">
              <h1>No tasks available...</h1>
            </div>
          ) : (
            <>
              <PaginationSelect
                className="self-end"
                value={pageSize}
                onChange={(value) => setPageSize(value)}
                label="Page size"
                items={[
                  { text: "5", value: "5" },
                  { text: "10", value: "10" },
                  { text: "20", value: "20" },
                ]}
                placeholder="Select page size"
              />
              <TasksList tasks={tasks} />
              <Pagination
                previousPage={decrementPage}
                nextPage={incrementPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

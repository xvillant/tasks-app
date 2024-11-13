import TaskForm from "@/components/task-form";
import TasksList from "@/components/tasks-list";
import Pagination from "@/components/pagination";
import axiosClient from "@/lib/axios";
import { PAGINATION_FIRST_PAGE, PAGINATION_LIMIT } from "@/lib/constants";
import { PaginatedResult, TaskResponse } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import PaginationSelect from "@/components/pagination-select";
import { parseAsInteger, useQueryState } from "nuqs";
import { TasksSkeleton } from "@/components/skeletons";
import { H2 } from "@/components/typography";

export default function TasksPage() {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(PAGINATION_FIRST_PAGE)
  );
  const [pageSize, setPageSize] = useQueryState(
    "size",
    parseAsInteger.withDefault(PAGINATION_LIMIT)
  );

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

  const onPageSizeChange = (value: string) => {
    setPage(PAGINATION_FIRST_PAGE);
    setPageSize(parseInt(value));
  };

  if (isError) {
    return <H2 className="text-center">{error.message}</H2>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <TaskForm />
      </div>
      <PaginationSelect
        className="self-end"
        value={pageSize}
        onChange={onPageSizeChange}
        label="Page size"
        items={[
          { text: "5", value: 5 },
          { text: "1", value: 1 },
          { text: "2", value: 2 },
        ]}
        placeholder="Select page size"
      />
      {isPending ? (
        <TasksSkeleton count={pageSize} />
      ) : (
        <>
          <TasksList tasks={tasks} />
          {tasks.last > 0 && (
            <Pagination
              actualPage={page}
              pages={tasks.last + 1}
              onChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}

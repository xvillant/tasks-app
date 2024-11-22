import TaskForm from "@/components/tasks/task-form";
import TasksList from "@/components/tasks/tasks-list";
import Pagination from "@/components/pagination";
import axiosClient from "@/lib/axios";
import {
  PAGINATION_FIRST_PAGE,
  PAGINATION_LIMIT,
  PAGINATION_LIMIT_OPTIONS,
} from "@/lib/constants";
import { PaginatedResult, Task } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import PaginationSelect from "@/components/pagination-select";
import { parseAsInteger, useQueryState } from "nuqs";
import { TasksSkeleton } from "@/components/tasks/tasks-skeleton";
import { H2 } from "@/components/typography";
import { parseAsFilter } from "@/lib/utils";
import FilteringButtons from "@/components/filtering-buttons";

export default function TasksPage() {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(PAGINATION_FIRST_PAGE)
  );
  const [pageSize, setPageSize] = useQueryState(
    "size",
    parseAsInteger.withDefault(PAGINATION_LIMIT)
  );
  const [filter, setFilter] = useQueryState(
    "filter",
    parseAsFilter.withDefault("all")
  );

  const {
    data: tasks,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks", { page, pageSize, filter }],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedResult<Task>>(
        `/tasks?size=${pageSize}&page=${page - 1}&sort=createdAt:desc${
          filter === "all"
            ? ""
            : `${
                filter === "completed"
                  ? "&filter=completed:eq:true"
                  : "&filter=completed:eq:false"
              }`
        }`
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
        items={PAGINATION_LIMIT_OPTIONS}
        placeholder="Select page size"
      />
      <FilteringButtons
        className="self-end"
        filter={filter}
        setFilter={setFilter}
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

import { PaginatedResult, TaskResponse } from "@/lib/types";
import { Accordion } from "@/components/ui/accordion";
import TaskItem from "./task-item";
import { H2 } from "@/components/typography";

export default function TasksList({
  tasks,
}: {
  tasks: PaginatedResult<TaskResponse>;
}) {
  if (tasks.total <= 0) {
    return <H2 className="text-center">No tasks available...</H2>;
  }

  return (
    <Accordion type="single" collapsible>
      {tasks.data.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </Accordion>
  );
}

import { PaginatedResult, TaskResponse } from "@/lib/types";
import { Accordion } from "@/components/ui/accordion";
import TaskItem from "./task-item";

export default function TasksList({
  tasks,
}: {
  tasks: PaginatedResult<TaskResponse>;
}) {
  return (
    <Accordion type="single" collapsible>
      {tasks.data.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </Accordion>
  );
}

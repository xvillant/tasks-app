import clsx from "clsx";
import { Button } from "./ui/button";
import { Filter } from "@/lib/types";
import { Options } from "nuqs";

export default function FilteringButtons({
  filter,
  setFilter,
  className,
}: {
  filter: Filter;
  setFilter: (
    value: Filter | ((old: Filter) => Filter | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
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
  );
}

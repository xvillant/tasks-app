import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Filter } from "@/lib/types";
import useSearchParams from "@/hooks/useSearchParams";

export default function FilteringButtons({
  onFilterChange,
  className,
}: {
  onFilterChange: (value: Filter) => void;
  className?: string;
}) {
  const { filter } = useSearchParams();

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <Button
        className={clsx({
          "bg-foreground text-background hover:bg-foreground/90":
            filter === "all",
        })}
        onClick={() => onFilterChange("all")}
      >
        All
      </Button>
      <Button
        className={clsx({
          "bg-foreground text-background hover:bg-foreground/90":
            filter === "completed",
        })}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </Button>
      <Button
        className={clsx({
          "bg-foreground text-background hover:bg-foreground/90":
            filter === "uncompleted",
        })}
        onClick={() => onFilterChange("uncompleted")}
      >
        Uncompleted
      </Button>
    </div>
  );
}

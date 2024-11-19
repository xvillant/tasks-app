import {
  PaginationContent,
  PaginationItem,
  Pagination as ShadPagination,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export default function Pagination({
  actualPage,
  onChange,
  pages,
}: {
  actualPage: number;
  onChange: (value: number) => void;
  pages: number;
}) {
  return (
    <ShadPagination>
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          {Array.from({ length: pages }, (_, index) => (
            <Button
              className={clsx({
                "bg-accent text-accent-foreground": actualPage === index + 1,
              })}
              variant="ghost"
              key={index}
              onClick={() => onChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
}

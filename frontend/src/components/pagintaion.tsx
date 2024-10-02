import {
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadPagination,
} from "@/components/ui/pagination";

export default function Pagination({
  previousPage,
  nextPage,
}: {
  previousPage: () => void;
  nextPage: () => void;
}) {
  return (
    <ShadPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={previousPage}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext className="cursor-pointer" onClick={nextPage} />
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
}

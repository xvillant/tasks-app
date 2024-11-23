import { PAGINATION_FIRST_PAGE, PAGINATION_LIMIT } from "@/lib/constants";
import { parseAsFilter } from "@/lib/utils";
import { parseAsInteger, useQueryState } from "nuqs";

export default function useSearchParams() {
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

  return { filter, setFilter, pageSize, setPageSize, page, setPage };
}

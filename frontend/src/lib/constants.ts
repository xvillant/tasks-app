import { Filter, PaginationOption } from "@/lib/types";

export const PAGINATION_FIRST_PAGE = 1;
export const PAGINATION_LIMIT = 5;

export const PAGINATION_LIMIT_OPTIONS: PaginationOption[] = [
  { text: "5", value: 5 },
  { text: "10", value: 10 },
  { text: "20", value: 20 },
];

export const FILTER_VALUES: Filter[] = ["all", "completed", "uncompleted"];

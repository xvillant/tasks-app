import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { PaginationOption } from "@/lib/types";

export default function PaginationSelect({
  value,
  label,
  items,
  placeholder,
  onChange,
  className,
}: {
  value: number;
  label?: string;
  placeholder: string;
  items: PaginationOption[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Select
      value={value.toString()}
      defaultValue={PAGINATION_LIMIT.toString()}
      onValueChange={onChange}
    >
      <SelectTrigger className={`w-[180px] ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label ? <SelectLabel>{label}</SelectLabel> : null}
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value.toString()}>
              {item.text}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

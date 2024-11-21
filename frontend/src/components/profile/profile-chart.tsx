import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "#16a34a",
  },
  uncompleted: {
    label: "Uncompleted",
    color: "#7f1d1d",
  },
} satisfies ChartConfig;

export default function ProfileChart({
  chartData,
}: {
  chartData: {
    status: string;
    completed: number | undefined;
    uncompleted: number | undefined;
  }[];
}) {
  return (
    <div className="flex-1">
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="status"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
          <Bar
            dataKey="uncompleted"
            fill="var(--color-uncompleted)"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

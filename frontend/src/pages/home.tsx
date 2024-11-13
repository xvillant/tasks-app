import { H1, H3 } from "@/components/typography";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <div className="flex flex-col max-w-md items-center gap-2 text-center">
        <H1 className="text-primary">Task Manager</H1>
        <H3>This is an application to manage your tasks</H3>
      </div>
    </div>
  );
}

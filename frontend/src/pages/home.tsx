import { H1, H3 } from "@/components/typography";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center relative">
      <div className="flex flex-col max-w-md items-center gap-2 text-center">
        <H1 className="text-primary">Task Manager</H1>
        <H3>This is an application to manage your tasks</H3>
      </div>
      <div className="size-4 bg-primary absolute top-16 left-16 animate-ping" />
      <div className="size-8 bg-primary absolute top-8 left-8 animate-ping" />
      <div className="size-4 bg-primary absolute bottom-16 right-16 animate-ping" />
      <div className="size-8 bg-primary absolute bottom-8 right-8 animate-ping" />
    </div>
  );
}

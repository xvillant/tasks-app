import { Loader } from "lucide-react";
import { RouterProvider } from "react-router-dom";
import router from "@/lib/router";

export default function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<Loader className="text-center animate-spin size-8" />}
    />
  );
}

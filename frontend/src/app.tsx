import { Loader } from "lucide-react";
import { RouterProvider } from "react-router-dom";
import router from "@/lib/router";

export default function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={
        <div className="grid place-items-center">
          <Loader className="animate-spin size-8" />
        </div>
      }
    />
  );
}

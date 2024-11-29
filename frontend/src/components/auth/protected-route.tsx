import { useUserStore } from "@/store/userStore";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <Outlet />;
};

import LoginForm from "@/components/login-form";
import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const user = useUserStore((state) => state.user);

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="grid place-items-center flex-1">
      <LoginForm />
    </div>
  );
}

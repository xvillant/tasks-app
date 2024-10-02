import RegisterForm from "@/components/register-form";
import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";

export default function RegisterPage() {
  const user = useUserStore((state) => state.user);

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="grid place-items-center flex-1">
      <RegisterForm />
    </div>
  );
}

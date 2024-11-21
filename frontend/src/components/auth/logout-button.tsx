import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        clearUser();
        navigate("/login");
      }}
    >
      Logout
    </Button>
  );
}

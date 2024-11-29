import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SignOutButton() {
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        clearUser();
        navigate("/auth");
      }}
    >
      Sign Out
    </Button>
  );
}

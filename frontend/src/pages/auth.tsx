import SignInForm from "@/components/auth/signIn-form";
import SignUpForm from "@/components/auth/signUp-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";

export default function AuthPage() {
  const user = useUserStore((state) => state.user);

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex-1 grid place-items-center">
      <Tabs defaultValue="signIn" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signIn">Sign In</TabsTrigger>
          <TabsTrigger value="signUp">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signIn">
          <SignInForm />
        </TabsContent>
        <TabsContent value="signUp">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

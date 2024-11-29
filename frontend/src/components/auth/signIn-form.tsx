import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse, SignInFormSchema, SignInFormValues } from "@/lib/types";
import { useUserStore } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { PasswordInput } from "@/components/ui/password-input";

export default function SignInForm() {
  const { toast } = useToast();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["signIn"],
    mutationFn: async (data: SignInFormValues) => {
      return await axiosClient.post("/auth/login", data);
    },
    onSuccess: (response) => {
      setUser(response.data);
      toast({
        title: "Successfully signed in",
      });
      navigate("/");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.data.statusCode === 401) {
        toast({ title: "Bad credentials", variant: "destructive" });
      } else {
        toast({ title: error.message, variant: "destructive" });
      }
    },
  });

  const onSubmit = (data: SignInFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-justify">
          Enter your username and password to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your username..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Type your password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {mutation.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

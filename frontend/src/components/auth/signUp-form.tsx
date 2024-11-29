import { ErrorResponse, SignUpFormSchema, SignUpFormValues } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axiosClient from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";

export default function SignUpForm() {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationKey: ["signUp"],
    mutationFn: async (data: SignUpFormValues) => {
      return await axiosClient.post("/users", data);
    },
    onSuccess: (response) => {
      setUser({
        role: response.data.role,
        token: response.data.token,
        userId: response.data.id,
        username: response.data.username,
      });
      toast({
        title: "Successfully signed up",
      });
      navigate("/");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: error.response?.data.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign Up
        </CardTitle>
        <CardDescription className="text-justify">
          Enter your valid credentials to sign up your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your first name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your last name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Type your email..."
                      {...field}
                    />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm your password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full col-span-2">
              {mutation.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

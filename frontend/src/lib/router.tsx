import { createBrowserRouter } from "react-router-dom";

import NotFoundPage from "@/pages/not-found";
import HomePage from "@/pages/home";
import Layout from "@/components/layout";
import TasksPage from "@/pages/tasks";
import { ProtectedRoute } from "@/components/protected-route";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ProfilePage from "@/pages/profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/tasks",
            element: <TasksPage />,
          },
          {
            path: "/profile/:username",
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;

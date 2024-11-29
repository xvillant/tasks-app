import { createBrowserRouter } from "react-router-dom";

import NotFoundPage from "@/pages/not-found";
import HomePage from "@/pages/home";
import Layout from "@/components/layout";
import TasksPage from "@/pages/tasks";
import { ProtectedRoute } from "@/components/auth/protected-route";
import AuthPage from "@/pages/auth";
import ProfilePage from "@/pages/profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
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

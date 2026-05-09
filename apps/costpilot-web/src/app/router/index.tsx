import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { LandingPage } from "../../features/landing/pages/LandingPage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

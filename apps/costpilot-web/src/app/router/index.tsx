import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { LandingPage } from "../../features/landing/pages/LandingPage";
import { AuditPage } from "../../features/audit/pages/AuditPage";
import { ReportPage } from "../../features/report/pages/ReportPage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
    ],
  },
  {
    path: "/audit",
    element: <AuditPage />,
  },
  {
    path: "/report/:publicId",
    element: <ReportPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

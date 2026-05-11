import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { LandingPage } from "../../features/landing/pages/LandingPage";
import { AuditPage } from "../../features/audit/pages/AuditPage";
import { ReportPage } from "../../features/report/pages/ReportPage";
import { WidgetPage } from "../../features/report/pages/WidgetPage";

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
  {
    path: "/widget/:publicId",
    element: <WidgetPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

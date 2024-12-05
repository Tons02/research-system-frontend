import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PreventLoginRoutes from "./PreventLoginRoutes";
import Mainlayout from "../../layout/MainLayout"
import Login from "../../components/Login";
import NotFound from "../../components/NotFound";
import Dashboard from "../../components/Dashboard";

const router = createBrowserRouter([
    {
      element: <PreventLoginRoutes />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
      ],
    },
    {
      path: "/dashboard",
      element: <Mainlayout />,
      errorElement: <PrivateRoutes />,  // Wrap the dashboard route with PrivateRoutes
      children: [
          {
            index: true,
            element: <Dashboard/>,
          },
        //   {
        //     path: "users",
        //     index: true,
        //     element: (
        //          <AccessPermissionContext
        //             permission="admin"
        //             context="routing"
        //           >
        //           <Users/>
        //         </AccessPermissionContext>
        //     )
        //   },
        //   {
        //       path: "monitoring",
        //       index: true,
        //       element: (
        //         <AccessPermissionContext
        //           permission="user"
        //           context="routing"
        //         >
        //         <DailyMonitoring/>
        //       </AccessPermissionContext>
        //   )
        //   },
        //   {
        //     path: "sugarConverter",
        //     index: true,
        //     element: (
        //       <SugarConverter/>
        //   )
        //   },
        //   {
        //     path: "settings",
        //     index: true,
        //     element: (
        //       <SettingPage/>
        // )
        // },
          {
            path: "*",
            element: <NotFound />,
          },
      ],
    }
  ]);
  


export const RouterModule = () => {
    return <RouterProvider router={router} />;
  };
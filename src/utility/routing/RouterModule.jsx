import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PreventLoginRoutes from "./PreventLoginRoutes";
import Mainlayout from "../../layout/MainLayout"
import Login from "../../pages/Login";
import NotFound from "../../pages/NotFound";
import Dashboard from "../../pages/Dashboard";
import Masterlist from "../../pages/Masterlist";
import AccessPermissionContext from "./AccessPermissionContext";
import Company from "../../pages/Company";
import UserManagement from "../../pages/UserManagement";
import User from "../../pages/User";
import Role from "../../pages/Role";

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
          {
            path: "masterlist",
            index: true,
            element: <Masterlist/>,
          },
          {
            path: "masterlist/company",
            index: true,
            element: (
                 <AccessPermissionContext
                    permission="masterlist:companies:sync"
                    context="routing"
                  >
                  <Company/>
                </AccessPermissionContext>
            )
          },
          {
            path: "user-management",
            index: true,
            element: (
                 <AccessPermissionContext
                    permission="user-management"
                    context="routing"
                  >
                  <UserManagement/>
                </AccessPermissionContext>
            )
          },
          
          {
            path: "user-management/user-accounts",
            index: true,
            element: (
                 <AccessPermissionContext
                    permission="user-management"
                    context="routing"
                  >
                  <User/>
                </AccessPermissionContext>
            )
          },
          {
            path: "user-management/role-management",
            index: true,
            element: (
                 <AccessPermissionContext
                    permission="user-accounts:crud"
                    context="routing"
                  >
                  <Role/>
                </AccessPermissionContext>
            )
          },
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
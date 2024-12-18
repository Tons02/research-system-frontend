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
import BusinessUnit from "../../pages/BusinessUnit";
import Department from "../../pages/Department";
import Unit from "../../pages/Unit";
import SubUnit from "../../pages/SubUnits";
import Location from "../../pages/Locations";

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
            path: "masterlist/business_unit",
            index: true,
            element: (
                 <AccessPermissionContext
                    permission="masterlist:business-units:sync"
                    context="routing"
                  >
                  <BusinessUnit/>
                </AccessPermissionContext>
            )
          },
          {
            path: "masterlist/department",
            index: true,
            element: (
                 <AccessPermissionContext
                    permission="masterlist:departments:sync"
                    context="routing"
                  >
                  <Department/>
                </AccessPermissionContext>
            )
          },
          {
            path: "masterlist/unit",
            index: true,
            element: (
                 <AccessPermissionContext
                    permission="masterlist:units:sync"
                    context="routing"
                  >
                  <Unit/>
                </AccessPermissionContext>
            )
          },
          {
            path: "masterlist/sub_unit",
            index: true,
            element: (
                 <AccessPermissionContext
                    permission="masterlist:subunits:sync"
                    context="routing"
                  >
                  <SubUnit/>
                </AccessPermissionContext>
            )
          },
          {
            path: "masterlist/locations",
            index: true,
            element: (
                 <AccessPermissionContext
                    permission="masterlist:locations:sync"
                    context="routing"
                  >
                  <Location/>
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
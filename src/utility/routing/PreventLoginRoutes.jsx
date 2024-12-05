import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const PreventLoginRoutes = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  console.log('prevent login routes', token);

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  return !token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PreventLoginRoutes;
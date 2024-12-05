import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      
    }
  }, [token, navigate]);

  return token ? <Outlet /> : null;
};

export default PrivateRoutes;
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";

const PublicRoute = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      const from = location.state?.from?.pathname || "/gantt";
      navigate(from, { replace: true });
    }
  }, [token, navigate, location]);

  return <Outlet />;
};

export default PublicRoute;

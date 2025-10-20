import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const PublicRoute = () => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Корректное поведение: не редиректим по одному факту наличия token.
    // Пусть ProtectedRoute решает доступ к защищенным страницам.
    setChecked(true);
  }, []);

  return checked ? <Outlet /> : null;
};

export default PublicRoute;

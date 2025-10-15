import { AuthProvider } from "./providers/AuthProvider";
import ProtectedRoute from "@shared/router/ProtectedRoute";
import PublicRoute from "@shared/router/PublicRoute";
import { router } from "@shared/router";
import { Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AdminHeader from "@shared/components/AdminHeader";

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <main className="max-w-7xl mx-auto">
            <Routes>
              {router.map((route) =>
                route.protected ? (
                  <Route
                    key={route.id}
                    path={route.path}
                    element={<ProtectedRoute element={route.element} />}
                  />
                ) : (
                  <Route key={route.id} path={route.path} element={<PublicRoute />}>
                    <Route path={route.path} element={route.element} />
                  </Route>
                )
              )}
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;

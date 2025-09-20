import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PublicRoutes } from "./public/PublicRoutes";
import { authRoutes, peerLinks, routes } from "./routes";
import { useAuthStore } from "../hooks";
import { AuthGuard, PrivateRoutes } from "./private";
import { AppHeaderMenu } from "../layouts/AppHeaderMenu";
import { RoutesNotFound } from "./not-found/RoutesNotFound";

const AuthRoutes = () => (
    <PublicRoutes>
        <Routes>
            <Route path={authRoutes.path} element={<authRoutes.Component />} />
            <Route
                path="/*"
                element={<Navigate replace to={authRoutes.link} />}
            />
        </Routes>
    </PublicRoutes>
);

export const AppRouter = () => {
    const { checkAuthToken } = useAuthStore();

    useEffect(() => {
        checkAuthToken();
    }, []);

    // Helper para renderizar rutas de acuerdo a la estructura dinámica
    const renderRoutes = (routeConfig) => {
        return routeConfig.map(({ path, Component, roles }) => (
            <Route
                key={path}
                path={path}
                element={
                    <PrivateRoutes requiredRole={roles}>
                        <AppHeaderMenu>
                            <Component />
                        </AppHeaderMenu>
                    </PrivateRoutes>
                }
            />
        ));
    };

    const renderStaffRoutes = (routeConfig) => {
        return routeConfig.map(({ path, Component }) => (
            <Route
                key={path}
                path={path}
                element={
                    <AuthGuard>
                        <AppHeaderMenu>
                            <Component />
                        </AppHeaderMenu>
                    </AuthGuard>
                }
            />
        ));
    };

    return (
        <Routes>
            <Route path="/*" element={<AuthRoutes />} />

            <Route
                path="/gerencia/*"
                element={
                    <RoutesNotFound>
                        {renderRoutes(routes.GERENCIA)}
                    </RoutesNotFound>
                }
            />

             <Route
                path="/staff/*"
                element={
                    <RoutesNotFound>
                        {renderStaffRoutes(peerLinks.peer)}
                    </RoutesNotFound>
                }
            />
            {/* </Route> */}
        </Routes>
    );
};

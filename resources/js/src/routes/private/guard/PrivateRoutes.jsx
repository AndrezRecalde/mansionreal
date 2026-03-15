import { Navigate, useLocation } from "react-router-dom";
import { ErrorAccessDenied } from "../../../pages";

export const PrivateRoutes = ({
    redirectPath = "/auth/login",
    children,
    requiredRole, // Ahora puede ser un string (un solo rol) o un array de roles
    requiredPermissions, // Permisos directos que también permiten el acceso
}) => {
    const location = useLocation();
    const token = localStorage.getItem("auth_token");
    const user = JSON.parse(localStorage.getItem("service_user"));
    const userPermissions = user?.permissions || [];

    // Verificar si el usuario está autenticado
    if (!token) {
        return <Navigate to={redirectPath} state={{ from: location }} />;
    }

    // Verificar si el usuario tiene el rol requerido
    const userHasRequiredRole = requiredRole
        ? Array.isArray(requiredRole)
            ? requiredRole.some((r) => user?.roles?.includes(r))
            : user?.roles?.includes(requiredRole)
        : false; // Si no hay rol requerido, no lo salvamos por rol

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const userHasRequiredPermission = requiredPermissions
        ? Array.isArray(requiredPermissions)
            ? requiredPermissions.some((perm) => userPermissions.includes(perm))
            : userPermissions.includes(requiredPermissions)
        : false;

    // Si la ruta no exige ni rol ni permiso, se considera pública-autenticada (acceso libre)
    const routeHasNoRestrictions = !requiredRole && !requiredPermissions;

    // Si el usuario no tiene el rol requerido NI el permiso requerido, y la ruta EXIGE restricciones, mostrar componente de acceso denegado
    if (!routeHasNoRestrictions && !userHasRequiredRole && !userHasRequiredPermission) {
        return <ErrorAccessDenied />;
    }

    // Si el usuario está autenticado y tiene el rol requerido, renderizar los children
    return children;
};

import { Navigate, useLocation } from "react-router-dom";
import { RUTA_DEFAULT } from "../menuRoutes";



export const PublicRoutes = ({ children }) => {
    const token = localStorage.getItem("auth_token");
    //const { token } = useAuthStore();
    const { state } = useLocation();

    const pathname = state?.from?.pathname ?? RUTA_DEFAULT;
    //console.log(pathname)

  return !token ? children : <Navigate to={pathname} />
}

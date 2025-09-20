import { Navigate, useLocation } from "react-router-dom";



export const PublicRoutes = ({ children }) => {
    const token = localStorage.getItem("auth_token");
    //const { token } = useAuthStore();
    const { state } = useLocation();

    const pathname = state?.from?.pathname ?? '/gerencia/dashboard';
    //console.log(pathname)

  return !token ? children : <Navigate to={pathname} />
}

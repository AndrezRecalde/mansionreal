import axios from "axios";
import { getEnv } from "../helpers/getEnv";

const { VITE_APP_URL } = getEnv();

const apiAxios = axios.create({
    baseURL: VITE_APP_URL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

let csrfTokenInitialized = false;
let isRefreshingToken = false;

const ensureCsrfToken = async () => {
    if (!csrfTokenInitialized && !isRefreshingToken) {
        isRefreshingToken = true;
        try {
            await axios.get(`${VITE_APP_URL}/sanctum/csrf-cookie`, {
                withCredentials: true,
            });
            csrfTokenInitialized = true;
        } catch (error) {
            console.error("Error al obtener CSRF token:", error);
        } finally {
            isRefreshingToken = false;
        }
    }
};

ensureCsrfToken();

apiAxios.interceptors.request.use(
    async (config) => {
        // Asegurar que el CSRF token esté inicializado antes de cada petición
        await ensureCsrfToken();

        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response, config } = error;

        if (response && response.status === 401) {
            // Verificar si el token realmente no existe o expiró
            const token = localStorage.getItem("auth_token");

            if (!token) {
                // No hay token, redirigir al login
                localStorage.clear();
                csrfTokenInitialized = false;
                window.location.href = "/auth/login";
            } else {
                // Hay token pero falló - puede ser que expiró
                // Solo redirigir si no es una petición que ya se está reintentando
                if (!config._retry) {
                    config._retry = true;

                    // Intentar refrescar el CSRF token
                    csrfTokenInitialized = false;
                    await ensureCsrfToken();

                    // Reintentar la petición una vez
                    try {
                        return await apiAxios(config);
                    } catch (retryError) {
                        // Si falla de nuevo, ahora sí redirigir
                        localStorage.clear();
                        csrfTokenInitialized = false;
                        window.location.href = "/auth/login";
                    }
                }
            }
        }

        if (response && response.status === 403) {
            console.error(
                "Error 403: No tienes permisos para acceder a este recurso"
            );
        }

        if (!response) {
            console.error("Error de red o servidor no disponible");
        }

        return Promise.reject(error);
    }
);

export default apiAxios;

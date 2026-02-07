import axios from "axios";
import { getEnv } from "../helpers/getEnv";
import Swal from "sweetalert2";

const { VITE_APP_URL } = getEnv();

const apiAxios = axios.create({
    baseURL: VITE_APP_URL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// ============================================================================
// REQUEST INTERCEPTOR - Agregar token de autenticación
// ============================================================================
apiAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// ============================================================================
// RESPONSE INTERCEPTOR - Manejo de errores
// ============================================================================
apiAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        // ========================================
        // 401 Unauthorized - Token inválido o expirado
        // ========================================
        if (response && response.status === 401) {
            // Limpiar localStorage y redirigir al login
            localStorage.clear();

            // Evitar múltiples redirects si ya estamos en login
            if (!window.location.pathname.includes("/auth/login")) {
                window.location.href = "/auth/login";
            }

            return Promise.reject(error);
        }

        // ========================================
        // 403 Forbidden - Sin permisos
        // ========================================
        if (response && response.status === 403) {
            console.error(
                "Error 403: No tienes permisos para acceder a este recurso",
            );

            Swal.fire({
                icon: "error",
                title: "Acceso Denegado",
                text: "No tienes permisos para realizar esta acción.",
            });
        }

        // ========================================
        // 419 Page Expired - CSRF token expirado (si se usa)
        // ========================================
        if (response && response.status === 419) {
            console.error("Sesión expirada. Por favor, recarga la página.");

            Swal.fire({
                icon: "warning",
                title: "Sesión Expirada",
                text: "Tu sesión ha expirado. Por favor, recarga la página.",
                confirmButtonText: "Recargar",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        }

        // ========================================
        // 500 Internal Server Error
        // ========================================
        if (response && response.status === 500) {
            console.error("Error 500: Error interno del servidor");

            Swal.fire({
                icon: "error",
                title: "Error del Servidor",
                text: "Ocurrió un error interno en el servidor. Por favor, intenta nuevamente más tarde.",
            });
        }

        // ========================================
        // Error de red o servidor no disponible
        // ========================================
        if (!response) {
            console.error("Error de red: No se pudo conectar con el servidor.");

            Swal.fire({
                icon: "error",
                title: "Error de Conexión",
                text: "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
            });
        }

        return Promise.reject(error);
    },
);

export default apiAxios;

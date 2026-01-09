import { useState, useCallback } from "react";
import { TABS } from "../../helpers/calendario.constants";

/**
 * Hook para manejar el cambio de tabs en la página de disponibilidad
 * Carga datos según el tab seleccionado
 * @param {Function} fnConsultarDisponibilidadDepartamentos - Función para cargar departamentos
 * @param {Function} fnCargarEstadias - Función para cargar estadías
 * @returns {Object} Estado del tab activo y handlers
 */
export const useDisponibilidadTabManagement = (
    fnConsultarDisponibilidadDepartamentos,
    fnCargarEstadias
) => {
    const [activeTab, setActiveTab] = useState(TABS.HOSPEDAJE);

    const handleTabChange = useCallback(
        (value) => {
            setActiveTab(value);

            if (value === TABS.HOSPEDAJE) {
                fnConsultarDisponibilidadDepartamentos();
            } else if (value === TABS.ESTADIA) {
                fnCargarEstadias();
            }
        },
        [fnConsultarDisponibilidadDepartamentos, fnCargarEstadias]
    );

    return {
        activeTab,
        handleTabChange,
    };
};

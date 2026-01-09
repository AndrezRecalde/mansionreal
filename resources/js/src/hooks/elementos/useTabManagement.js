import { useState, useCallback } from "react";
import { TABS } from "../../helpers/calendario.constants.js";

/**
 * Hook personalizado para manejar el estado y comportamiento de los tabs
 * @param {Function} fnCargarEstadias - Función para cargar las estadías
 * @returns {Object} Estado y funciones para manejar tabs
 */
export const useTabManagement = (fnCargarEstadias) => {
    const [activeTab, setActiveTab] = useState(TABS.HOSPEDAJE);
    const [tabsVisitados, setTabsVisitados] = useState(
        () => new Set([TABS.HOSPEDAJE])
    );

    const handleTabChange = useCallback(
        (value) => {
            if (!value) return;

            setActiveTab(value);
            setTabsVisitados((prev) => new Set([...prev, value]));

            // Cargar estadías solo la primera vez que se visita el tab
            if (value === TABS.ESTADIA && !tabsVisitados.has(TABS.ESTADIA)) {
                fnCargarEstadias();
            }
        },
        [fnCargarEstadias, tabsVisitados]
    );

    return {
        activeTab,
        tabsVisitados,
        handleTabChange,
    };
};

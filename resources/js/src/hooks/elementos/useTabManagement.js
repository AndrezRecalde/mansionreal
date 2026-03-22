import { useState } from "react";
import { TABS } from "../../helpers/calendario.constants.js";

/**
 * Hook personalizado para manejar el estado de tab activo en el Calendario
 * Solo existe el tab HOSPEDAJE
 * @returns {Object} Estado y set de tabs visitados
 */
export const useTabManagement = () => {
    const [activeTab] = useState(TABS.HOSPEDAJE);
    const [tabsVisitados] = useState(() => new Set([TABS.HOSPEDAJE]));

    return {
        activeTab,
        tabsVisitados,
    };
};

import { useMemo } from "react";
import { Tabs } from "@mantine/core";
import { TABS } from "../../../helpers/calendario.constants.js";
import { CalendarioReservas } from "../../calendario/section/CalendarioReservas";
import { LoadingSkeleton } from "../loader/LoadingSkeleton";
import { EstadiasReservadasCards } from "../../reserva/cards/EstadiasReservadasCards";

/**
 * Componente que maneja el contenido de los tabs
 * @param {string} activeTab - Tab activo actualmente
 * @param {Set} tabsVisitados - Set de tabs que han sido visitados
 * @param {boolean} cargandoEstadias - Estado de carga de estadías
 */
export const TabContent = ({ activeTab, tabsVisitados, cargandoEstadias }) => {
    const renderTabPanel = useMemo(() => {
        return {
            [TABS.HOSPEDAJE]: tabsVisitados.has(TABS.HOSPEDAJE) && (
                <CalendarioReservas />
            ),
            [TABS.ESTADIA]: cargandoEstadias ? (
                <LoadingSkeleton />
            ) : (
                <EstadiasReservadasCards />
            ),
        };
    }, [tabsVisitados, cargandoEstadias]);

    return (
        <>
            <Tabs.Panel value={TABS.HOSPEDAJE} pt="xs">
                {renderTabPanel[TABS.HOSPEDAJE]}
            </Tabs.Panel>

            <Tabs.Panel value={TABS.ESTADIA} pt="xs">
                {renderTabPanel[TABS.ESTADIA]}
            </Tabs.Panel>
        </>
    );
};

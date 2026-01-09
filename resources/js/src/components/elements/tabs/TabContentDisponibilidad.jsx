import { Tabs } from "@mantine/core";
import { TABS } from "../../../helpers/calendario.constants";
import { LoadingSkeleton } from "../loader/LoadingSkeleton";
import { DepartamentosDisponiblesCards } from "../../departamento/cards/DepartamentosDisponiblesCards";
import { EstadiasReservadasCards } from "../../reserva/cards/EstadiasReservadasCards";

/**
 * Componente que renderiza el contenido de los tabs de disponibilidad
 * @param {boolean} cargandoDepartamentos - Estado de carga de departamentos
 * @param {boolean} cargandoEstadias - Estado de carga de estadías
 * @param {Object} usuario - Datos del usuario actual
 */
export const TabContentDisponibilidad = ({
    cargandoDepartamentos,
    cargandoEstadias,
    usuario,
}) => {
    return (
        <>
            <Tabs.Panel value={TABS.HOSPEDAJE} pt="xs">
                {cargandoDepartamentos ? (
                    <LoadingSkeleton />
                ) : (
                    <DepartamentosDisponiblesCards usuario={usuario} />
                )}
            </Tabs.Panel>

            <Tabs.Panel value={TABS.ESTADIA} pt="xs">
                {cargandoEstadias ? (
                    <LoadingSkeleton />
                ) : (
                    <EstadiasReservadasCards />
                )}
            </Tabs.Panel>
        </>
    );
};

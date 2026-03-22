import { LoadingSkeleton } from "../loader/LoadingSkeleton";
import { DepartamentosDisponiblesCards } from "../../departamento/cards/DepartamentosDisponiblesCards";

/**
 * Componente que renderiza los departamentos disponibles (HOSPEDAJE)
 * Ya no utiliza Tabs — se eliminó el tipo ESTADIA
 * @param {boolean} cargandoDepartamentos - Estado de carga de departamentos
 * @param {Object} usuario - Datos del usuario actual
 */
export const TabContentDisponibilidad = ({ cargandoDepartamentos, usuario }) => {
    return cargandoDepartamentos ? (
        <LoadingSkeleton />
    ) : (
        <DepartamentosDisponiblesCards usuario={usuario} />
    );
};

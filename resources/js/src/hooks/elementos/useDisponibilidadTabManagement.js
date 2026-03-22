/**
 * Hook para la página de disponibilidad
 * Ya no existe tab de Estadías — solo se carga disponibilidad de departamentos
 * @param {Function} fnConsultarDisponibilidadDepartamentos - Función para cargar departamentos
 */
export const useDisponibilidadTabManagement = (
    fnConsultarDisponibilidadDepartamentos
) => {
    // ya no hay manejo de tabs — se mantiene el hook para no romper imports existentes
    return {};
};

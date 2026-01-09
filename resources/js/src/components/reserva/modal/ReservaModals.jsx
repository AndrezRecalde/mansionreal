import {
    ConsumosDrawer,
    PagoModal,
    PagoEditarModal,
    ConsumoModal,
    ReservaFinalizarModal,
    GastoModal,
    ConsumoEditarModal,
    ConsumoEliminarModal,
} from "../../../components";

/**
 * Componente que agrupa todos los modales relacionados con reservas
 * @param {Object} datos_reserva - Datos de la reserva activa
 * @param {Function} fnAsignarDepartamento - Función para asignar departamento
 */
export const ReservaModals = ({ datos_reserva, fnAsignarDepartamento }) => {
    if (!datos_reserva) return null;

    return (
        <>
            <ConsumosDrawer
                datos_reserva={datos_reserva}
                fnAsignarElemento={fnAsignarDepartamento}
            />
            <PagoModal reservaId={datos_reserva.reserva_id} />
            <PagoEditarModal reservaId={datos_reserva.reserva_id} />
            <ConsumoModal reserva_id={datos_reserva.reserva_id} />
            <ReservaFinalizarModal datos_reserva={datos_reserva} />
            <GastoModal activarElemento={datos_reserva} />
            <ConsumoEditarModal />
            <ConsumoEliminarModal />
        </>
    );
};

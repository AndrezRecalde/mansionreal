import { useEffect } from "react";
import { Container, Divider, Loader, Center } from "@mantine/core";
import {
    ConsumoModal,
    ConsumosDrawer,
    //DisponibilidadCards,
    DisponibilidadTable,
    FiltroDisponibilidad,
    GastoModal,
    ReservaFinalizarModal,
    ReservarDepartamentoModal,
    TitlePage,
} from "../../components";
import {
    useDepartamentoStore,
    useReservaDepartamentoStore,
    useTitleHook,
    useUiConsumo,
} from "../../hooks";
import Swal from "sweetalert2";


const DisponibilidadActualPage = () => {
    useTitleHook("Disponibilidad - Mansión Real");
    const { cargando, activarDepartamento, fnAsignarDepartamento } =
        useDepartamentoStore();
    const { fnConsultarDisponibilidadDepartamentos, fnLimpiarDepartamentos } =
        useDepartamentoStore();
    const {
        fnAbrirDrawerConsumosDepartamento,
    } = useUiConsumo();

    const { mensaje, errores } = useReservaDepartamentoStore();

    const datos_reserva = {
        numero_departamento: activarDepartamento?.numero_departamento,
        codigo_reserva: activarDepartamento?.reserva?.codigo_reserva,
        reserva_id: activarDepartamento?.reserva?.id,
        huesped: activarDepartamento?.reserva?.huesped,
        fecha_checkin: activarDepartamento?.reserva?.fecha_checkin,
        fecha_checkout: activarDepartamento?.reserva?.fecha_checkout,
        total_noches: activarDepartamento?.reserva?.total_noches,
    }

    useEffect(() => {
        fnConsultarDisponibilidadDepartamentos();
        return () => {
            //fnLimpiarDepartamentos();
        };
    }, []);

    useEffect(() => {
        if (mensaje !== undefined) {
            Swal.fire({
                icon: mensaje.status,
                text: mensaje.msg,
                showConfirmButton: true,
            });
            return;
        }
    }, [mensaje]);

    useEffect(() => {
        if (errores !== undefined) {
            Swal.fire({
                icon: "error",
                text: errores,
                showConfirmButton: true,
            });
            return;
        }
    }, [errores]);

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Disponibilidad Actual</TitlePage>
            <Divider my={10} />
            <FiltroDisponibilidad
                titulo="Buscar disponibilidad"
                fnHandleAction={fnConsultarDisponibilidadDepartamentos}
                cargando={cargando}
            />

            {cargando ? (
                <Center my={70}>
                    <Loader size="xl" />
                </Center>
            ) : (
                <DisponibilidadTable
                    setOpened={fnAbrirDrawerConsumosDepartamento}
                />
            )}

            <ReservarDepartamentoModal />
            <ConsumosDrawer
                datos_reserva={datos_reserva}
                fnAsignarElemento={fnAsignarDepartamento}
            />
            <ConsumoModal reserva_id={datos_reserva.reserva_id} />
            <GastoModal />
            <ReservaFinalizarModal datos_reserva={datos_reserva} />
        </Container>
    );
};

export default DisponibilidadActualPage;

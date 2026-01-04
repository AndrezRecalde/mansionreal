import { Container, Divider, Group, Skeleton, Tabs } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
    CalendarioHeader,
    CalendarioReservas,
    ConsumoEditarModal,
    ConsumoEliminarModal,
    ConsumoModal,
    ConsumosDrawer,
    EstadiasReservadasCards,
    GastoModal,
    PagoEditarModal,
    PagoModal,
    ReservaFinalizarModal,
    ReservarDepartamentoModal,
} from "../../components";
import {
    useCalendarioStore,
    useDepartamentoStore,
    useEstadiaStore,
    useReservaDepartamentoStore,
    useTitleHook,
    useUiReservaDepartamento,
} from "../../hooks";
import classes from "./modules/Tabs.module.css";

const TABS = {
    HOSPEDAJE: "HOSPEDAJE",
    ESTADIA: "ESTADIA",
};

const SKELETON_COUNT = 3;

// Componente memorizado para el skeleton
const LoadingSkeleton = () => (
    <Group gap={20}>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <Skeleton key={i} height={80} mt={6} width="30%" radius="md" />
        ))}
    </Group>
);

// Componente separado para los modales de reserva
const ReservaModals = ({ datos_reserva, fnAsignarDepartamento }) => (
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

// Hook personalizado para manejar notificaciones
const useNotificaciones = () => {
    const { mensaje: mensajeCalendario, errores: erroresCalendario } =
        useCalendarioStore();
    const { mensaje: mensajeReserva, errores: erroresReserva } =
        useReservaDepartamentoStore();
    const { mensaje: mensajeEstadia, errores: erroresEstadia } =
        useEstadiaStore();

    useEffect(() => {
        const notificaciones = [
            mensajeCalendario,
            erroresCalendario,
            mensajeReserva,
            erroresReserva,
            mensajeEstadia,
            erroresEstadia,
        ].filter(Boolean);

        if (notificaciones.length > 0) {
            // Mostrar solo la primera notificación para evitar múltiples popups
            const notificacion = notificaciones[0];
            Swal.fire({
                icon: notificacion.status,
                text: notificacion.msg,
                showConfirmButton: true,
            });
        }
    }, [
        mensajeCalendario,
        erroresCalendario,
        mensajeReserva,
        erroresReserva,
        mensajeEstadia,
        erroresEstadia,
    ]);
};

const CalendarioReservasPage = () => {
    useTitleHook("Mansion Real - Calendario de Reservas");
    useNotificaciones();

    const [activeTab, setActiveTab] = useState(TABS.HOSPEDAJE);
    const [tabsVisitados, setTabsVisitados] = useState(
        () => new Set([TABS.HOSPEDAJE])
    );
    const {
        activarEstadia,
        cargando: cargandoEstadias,
        fnCargarEstadias,
    } = useEstadiaStore();
    const { fnAsignarTipoReserva, activarReserva } = useReservaDepartamentoStore();
    const { fnAbrirModalReservarDepartamento } = useUiReservaDepartamento();
    const { fnAsignarDepartamento } = useDepartamentoStore();

    // Memoización de datos_reserva para evitar recreación en cada render
    const datos_reserva = useMemo(() => {
        if (activarReserva) {
            return {
                departamento_id: activarReserva.departamento_id,
                numero_departamento: activarReserva.numero_departamento,
                codigo_reserva: activarReserva.codigo_reserva,
                reserva_id: activarReserva.reserva_id,
                huesped: activarReserva.huesped,
                fecha_checkin: activarReserva.fecha_checkin,
                fecha_checkout: activarReserva.fecha_checkout,
                total_noches: activarReserva.total_noches,
                estado: activarReserva.estado,
            };
        }

        if (activarEstadia) {
            return {
                codigo_reserva: activarEstadia.codigo_reserva,
                reserva_id: activarEstadia.id,
                huesped: activarEstadia.huesped,
                fecha_checkin: activarEstadia.fecha_checkin,
                fecha_checkout: activarEstadia.fecha_checkout,
                total_noches: activarEstadia.total_noches,
                estado: activarEstadia.estado,
            };
        }

        return null;
    }, [activarReserva, activarEstadia]);

    const handleTabChange = useCallback(
        (value) => {
            if (!value) return;

            setActiveTab(value);
            setTabsVisitados((prev) => new Set([...prev, value]));

            if (value === TABS.ESTADIA && !tabsVisitados.has(TABS.ESTADIA)) {
                fnCargarEstadias();
            }
        },
        [fnCargarEstadias, tabsVisitados]
    );

    const handleReservar = useCallback(() => {
        fnAsignarTipoReserva("HOSPEDAJE");
        fnAbrirModalReservarDepartamento(true);
    }, [fnAsignarTipoReserva, fnAbrirModalReservarDepartamento]);

    const handleEstadia = useCallback(() => {
        fnAsignarTipoReserva("ESTADIA");
        fnAbrirModalReservarDepartamento(true);
    }, [fnAsignarTipoReserva, fnAbrirModalReservarDepartamento]);

    // Memorizar el contenido de los tabs para evitar re-renders innecesarios
    const tabContent = useMemo(
        () => ({
            [TABS.HOSPEDAJE]: tabsVisitados.has(TABS.HOSPEDAJE) && (
                <CalendarioReservas />
            ),
            [TABS.ESTADIA]: cargandoEstadias ? (
                <LoadingSkeleton />
            ) : (
                <EstadiasReservadasCards />
            ),
        }),
        [tabsVisitados, cargandoEstadias]
    );

    return (
        <Container size="xl" py="md">
            <CalendarioHeader
                onReservar={handleReservar}
                onEstadia={handleEstadia}
            />
            <Divider my="md" />
            <Tabs
                variant="unstyled"
                value={activeTab}
                onChange={handleTabChange}
                classNames={classes}
                keepMounted={false}
            >
                <Tabs.List grow>
                    <Tabs.Tab value={TABS.HOSPEDAJE}>Hospedajes</Tabs.Tab>
                    <Tabs.Tab value={TABS.ESTADIA}>Estadías</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value={TABS.HOSPEDAJE} pt="xs">
                    {tabContent[TABS.HOSPEDAJE]}
                </Tabs.Panel>

                <Tabs.Panel value={TABS.ESTADIA} pt="xs">
                    {tabContent[TABS.ESTADIA]}
                </Tabs.Panel>
            </Tabs>

            <ReservarDepartamentoModal />
            {datos_reserva && (
                <ReservaModals
                    datos_reserva={datos_reserva}
                    fnAsignarDepartamento={fnAsignarDepartamento}
                />
            )}
        </Container>
    );
};

export default CalendarioReservasPage;

import { useEffect } from "react";
import { Container, Divider, Tabs } from "@mantine/core";
import {
    CalendarioHeader,
    ReservarDepartamentoModal,
    TabContent,
    ReservaModals,
} from "../../components";
import {
    useEstadiaStore,
    useReservaDepartamentoStore,
    useTitleHook,
    useNotificaciones,
    useDatosReserva,
    useTabManagement,
    useReservaActions,
    useStorageField,
    usePagoStore,
    useConsumoStore,
    useGastoStore,
} from "../../hooks";
import classes from "./modules/Tabs.module.css";
import {
    PAGE_CONFIG,
    STORAGE_FIELDS,
    TABS,
} from "../../helpers/calendario.constants";
import { PAGE_TITLE } from "../../helpers/getPrefix";
import Swal from "sweetalert2";

const CalendarioReservasPage = () => {
    // Configuración inicial
    useTitleHook(PAGE_CONFIG.CALENDARIO.TITLE);
    useNotificaciones();
    const { fnSetStorageFields } = useStorageField();

    useEffect(() => {
        fnSetStorageFields({ carga_pagina: STORAGE_FIELDS.CARGA_PAGINA });

        return () => {
            fnSetStorageFields(null);
        };
    }, []);

    // Stores
    const {
        activarEstadia,
        cargando: cargandoEstadias,
        fnCargarEstadias,
        fnAsignarEstadia,
    } = useEstadiaStore();
    const { activarReserva, fnAsignarReserva } = useReservaDepartamentoStore();

    // Hooks personalizados
    const { activeTab, tabsVisitados, handleTabChange } =
        useTabManagement(fnCargarEstadias);
    const { handleReservar, handleEstadia } = useReservaActions();
    const datos_reserva = useDatosReserva(activarReserva, activarEstadia);

    const { mensaje: mensajePagos, errores: erroresPagos } = usePagoStore();
    const { mensaje: mensajeConsumos, errores: erroresConsumos } =
        useConsumoStore();
    const { mensaje: mensajeGastos, errores: erroresGastos } = useGastoStore();

    useEffect(() => {
        if (mensajeGastos !== undefined) {
            Swal.fire({
                icon: mensajeGastos.status,
                text: mensajeGastos.msg,
                showConfirmButton: true,
            });
        }
    }, [mensajeGastos]);

    useEffect(() => {
        if (erroresGastos !== undefined) {
            Swal.fire({
                icon: "error",
                text: erroresGastos,
                showConfirmButton: true,
            });
        }
    }, [erroresGastos]);

    useEffect(() => {
        if (mensajeConsumos !== undefined) {
            Swal.fire({
                icon: mensajeConsumos.status,
                text: mensajeConsumos.msg,
                showConfirmButton: true,
            });
        }
    }, [mensajeConsumos]);

    useEffect(() => {
        if (erroresConsumos !== undefined) {
            Swal.fire({
                icon: "error",
                text: erroresConsumos,
                showConfirmButton: true,
            });
        }
    }, [erroresConsumos]);

    useEffect(() => {
        if (mensajePagos !== undefined) {
            Swal.fire({
                icon: mensajePagos.status,
                text: mensajePagos.msg,
                showConfirmButton: true,
            });
        }
    }, [mensajePagos]);

    useEffect(() => {
        if (erroresPagos !== undefined) {
            Swal.fire({
                icon: "error",
                text: erroresPagos,
                showConfirmButton: true,
            });
        }
    }, [erroresPagos]);

    return (
        <Container
            size={PAGE_CONFIG.CALENDARIO.CONTAINER_SIZE}
            py={{ base: "xs", sm: "sm", md: PAGE_CONFIG.CALENDARIO.PADDING }}
            px={{ base: "xs", sm: "md" }}
        >
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
                orientation="horizontal"
            >
                <Tabs.List grow>
                    <Tabs.Tab value={TABS.HOSPEDAJE}>
                        {PAGE_TITLE.CALENDARIO_RESERVAS.TABS.RESERVAS}
                    </Tabs.Tab>
                    <Tabs.Tab value={TABS.ESTADIA}>
                        {PAGE_TITLE.CALENDARIO_RESERVAS.TABS.ESTADIAS}
                    </Tabs.Tab>
                </Tabs.List>

                <TabContent
                    activeTab={activeTab}
                    tabsVisitados={tabsVisitados}
                    cargandoEstadias={cargandoEstadias}
                />
            </Tabs>

            <ReservarDepartamentoModal />
            <ReservaModals
                datos_reserva={datos_reserva}
                fnAsignarDepartamento={
                    activeTab === TABS.HOSPEDAJE
                        ? fnAsignarReserva
                        : fnAsignarEstadia
                }
            />
        </Container>
    );
};

export default CalendarioReservasPage;

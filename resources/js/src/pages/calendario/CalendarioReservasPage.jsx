import { useEffect } from "react";
import { Container, Divider, Tabs } from "@mantine/core";
import {
    CalendarioHeader,
    ReservarDepartamentoModal,
    TabContent,
    ReservaModals,
} from "../../components";
import {
    useDepartamentoStore,
    useEstadiaStore,
    useReservaDepartamentoStore,
    useTitleHook,
    useNotificaciones,
    useDatosReserva,
    useTabManagement,
    useReservaActions,
    useStorageField,
} from "../../hooks";
import classes from "./modules/Tabs.module.css";
import {
    PAGE_CONFIG,
    STORAGE_FIELDS,
    TABS,
} from "../../helpers/calendario.constants";

/**
 * Página principal del calendario de reservas
 * Gestiona la visualización de hospedajes y estadías
 * Incluye modales para gestión de reservas, pagos y consumos
 */
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
    //const { fnAsignarDepartamento } = useDepartamentoStore();

    // Hooks personalizados
    const { activeTab, tabsVisitados, handleTabChange } =
        useTabManagement(fnCargarEstadias);
    const { handleReservar, handleEstadia } = useReservaActions();
    const datos_reserva = useDatosReserva(activarReserva, activarEstadia);

    return (
        <Container
            size={PAGE_CONFIG.CALENDARIO.CONTAINER_SIZE}
            py={PAGE_CONFIG.CALENDARIO.PADDING}
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
            >
                <Tabs.List grow>
                    <Tabs.Tab value={TABS.HOSPEDAJE}>Hospedajes</Tabs.Tab>
                    <Tabs.Tab value={TABS.ESTADIA}>Estadías</Tabs.Tab>
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

import { useEffect, useMemo, useCallback } from "react";
import { Container, Divider, Group, Skeleton, Tabs } from "@mantine/core";
import {
    ConsumoEditarModal,
    ConsumoEliminarModal,
    ConsumoModal,
    ConsumosDrawer,
    DepartamentosDisponiblesCards,
    EstadiasReservadasCards,
    GastoModal,
    LimpiezaModal,
    PagoEditarModal,
    PagoModal,
    ReservaFinalizarModal,
    TitlePage,
} from "../../components";
import {
    useDepartamentoStore,
    useEstadiaStore,
    useTitleHook,
} from "../../hooks";
import classes from "./modules/Tabs.module.css";

// Constantes extraídas
const TABS = {
    HOSPEDAJE: "HOSPEDAJE",
    ESTADIA: "ESTADIA",
};

const SKELETON_COUNT = 3;

// Componente separado para los skeletons
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

const DisponibilidadDepartamentoPage = () => {
    useTitleHook("Disponibilidad Actual - Mansion Real");
    const usuario = JSON.parse(localStorage.getItem("service_user") || "{}");

    const {
        cargando: cargandoDepartamentos,
        fnAsignarDepartamento,
        activarDepartamento,
        fnConsultarDisponibilidadDepartamentos,
        fnLimpiarDepartamentos,
    } = useDepartamentoStore();

    const {
        cargando: cargandoEstadias,
        activarEstadia,
        fnCargarEstadias,
        fnLimpiarEstadias,
    } = useEstadiaStore();

    // Memoización de datos_reserva para evitar recreación en cada render
    const datos_reserva = useMemo(() => {
        if (activarDepartamento?.reserva) {
            return {
                departamento_id: activarDepartamento.id,
                numero_departamento: activarDepartamento.numero_departamento,
                codigo_reserva: activarDepartamento.reserva.codigo_reserva,
                reserva_id: activarDepartamento.reserva.id,
                huesped: activarDepartamento.reserva.huesped,
                fecha_checkin: activarDepartamento.reserva.fecha_checkin,
                fecha_checkout: activarDepartamento.reserva.fecha_checkout,
                total_noches: activarDepartamento.reserva.total_noches,
                estado: activarDepartamento.reserva.estado,
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
    }, [activarDepartamento, activarEstadia]);

    const handleTabChange = useCallback(
        (value) => {
            if (value === TABS.HOSPEDAJE) {
                fnConsultarDisponibilidadDepartamentos();
            } else if (value === TABS.ESTADIA) {
                fnCargarEstadias();
            }
        },
        [fnConsultarDisponibilidadDepartamentos, fnCargarEstadias]
    );

    // Efecto de inicialización y limpieza
    useEffect(() => {
        fnConsultarDisponibilidadDepartamentos();

        return () => {
            fnLimpiarDepartamentos();
            fnLimpiarEstadias();
        };
    }, []);

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>
                Disponibilidad Actual - Mansion Real
            </TitlePage>
            <Divider my={10} />

            <Tabs
                variant="unstyled"
                defaultValue={TABS.HOSPEDAJE}
                mt="md"
                onChange={handleTabChange}
                classNames={classes}
            >
                <Tabs.List grow>
                    <Tabs.Tab value={TABS.HOSPEDAJE}>Hospedajes</Tabs.Tab>
                    <Tabs.Tab value={TABS.ESTADIA}>Estadías</Tabs.Tab>
                </Tabs.List>

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
            </Tabs>

            {datos_reserva && (
                <ReservaModals
                    datos_reserva={datos_reserva}
                    fnAsignarDepartamento={fnAsignarDepartamento}
                />
            )}
            <LimpiezaModal />
        </Container>
    );
};

export default DisponibilidadDepartamentoPage;

import { useEffect } from "react";
import { Container, Divider, Group, Skeleton, Tabs } from "@mantine/core";
import {
    BtnSection,
    ConsumoEditarModal,
    ConsumoEliminarModal,
    ConsumoModal,
    ConsumosDrawer,
    DepartamentosDisponiblesCards,
    EstadiasReservadasCards,
    FiltroDisponibilidad,
    GastoModal,
    LimpiezaModal,
    PagoEditarModal,
    PagoModal,
    ReservaFinalizarModal,
    ReservarDepartamentoModal,
    TitlePage,
} from "../../components";
import {
    useDepartamentoStore,
    useEstadiaStore,
    useReservaDepartamentoStore,
    useTitleHook,
    useUiReservaDepartamento,
} from "../../hooks";
import { IconBeach } from "@tabler/icons-react";
import classes from "./modules/Tabs.module.css";

const DisponibilidadDepartamentoPage = () => {
    useTitleHook("Disponibilidad - Mansion Real");
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

    const { fnAsignarTipoReserva } = useReservaDepartamentoStore();
    const { fnAbrirModalReservarDepartamento } = useUiReservaDepartamento();

    const datos_reserva = activarDepartamento?.reserva
        ? {
              departamento_id: activarDepartamento.id,
              numero_departamento: activarDepartamento.numero_departamento,
              codigo_reserva: activarDepartamento.reserva.codigo_reserva,
              reserva_id: activarDepartamento.reserva.id,
              huesped: activarDepartamento.reserva.huesped,
              fecha_checkin: activarDepartamento.reserva.fecha_checkin,
              fecha_checkout: activarDepartamento.reserva.fecha_checkout,
              total_noches: activarDepartamento.reserva.total_noches,
              estado: activarDepartamento.reserva.estado,
          }
        : activarEstadia
        ? {
              codigo_reserva: activarEstadia.codigo_reserva,
              reserva_id: activarEstadia.id,
              huesped: activarEstadia.huesped,
              fecha_checkin: activarEstadia.fecha_checkin,
              fecha_checkout: activarEstadia.fecha_checkout,
              total_noches: activarEstadia.total_noches,
              estado: activarEstadia.estado,
          }
        : null;

    useEffect(() => {
        // Al inicio carga solo hospedajes
        fnConsultarDisponibilidadDepartamentos();
        return () => {
            fnLimpiarDepartamentos();
            fnLimpiarEstadias();
        };
    }, []);

    const handleReservarEstadia = () => {
        fnAsignarTipoReserva("ESTADIA");
        fnAbrirModalReservarDepartamento(true);
    };

    return (
        <Container size="xl" my={20}>
            <Group justify="space-between">
                <TitlePage order={2}>
                    Disponibilidad Actual - Mansion Real
                </TitlePage>
                <BtnSection
                    IconSection={IconBeach}
                    handleAction={handleReservarEstadia}
                >
                    Agregar Estadia
                </BtnSection>
            </Group>

            <Divider my={10} />

            <Tabs
                variant="unstyled"
                defaultValue="HOSPEDAJE"
                mt="md"
                onChange={(value) => {
                    if (value === "HOSPEDAJE")
                        fnConsultarDisponibilidadDepartamentos();
                    if (value === "ESTADIA") fnCargarEstadias();
                }}
                classNames={classes}
            >
                <Tabs.List grow>
                    <Tabs.Tab value="HOSPEDAJE">Hospedajes</Tabs.Tab>
                    <Tabs.Tab value="ESTADIA">Estadías</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="HOSPEDAJE" pt="xs">
                    <FiltroDisponibilidad
                        titulo="Buscar disponibilidad"
                        fnHandleAction={fnConsultarDisponibilidadDepartamentos}
                    />
                    {cargandoDepartamentos ? (
                        <Group gap={20}>
                            {[1, 2, 3].map((item) => (
                                <Skeleton
                                    key={item}
                                    height={80}
                                    mt={6}
                                    width="30%"
                                    radius="md"
                                />
                            ))}
                        </Group>
                    ) : (
                        <DepartamentosDisponiblesCards />
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="ESTADIA" pt="xs">
                    {cargandoEstadias ? (
                        <Group gap={20}>
                            {[1, 2, 3].map((item) => (
                                <Skeleton
                                    key={item}
                                    height={80}
                                    mt={6}
                                    width="30%"
                                    radius="md"
                                />
                            ))}
                        </Group>
                    ) : (
                        <EstadiasReservadasCards />
                    )}
                </Tabs.Panel>
            </Tabs>

            <ReservarDepartamentoModal />

            {datos_reserva && (
                <>
                    <ConsumosDrawer
                        datos_reserva={datos_reserva}
                        fnAsignarElemento={fnAsignarDepartamento}
                    />
                    <PagoModal reservaId={datos_reserva.reserva_id} />
                    <PagoEditarModal reservaId={datos_reserva.reserva_id} />
                    <ConsumoModal reserva_id={datos_reserva.reserva_id} />
                    <ReservaFinalizarModal datos_reserva={datos_reserva} />

                    <GastoModal />
                    <ConsumoEditarModal />
                    <ConsumoEliminarModal />
                </>
            )}
            <LimpiezaModal />
        </Container>
    );
};

export default DisponibilidadDepartamentoPage;

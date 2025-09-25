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
    ReservaFinalizarModal,
    ReservarDepartamentoModal,
    TitlePage,
} from "../../components";
import {
    useDepartamentoStore,
    useEstadiaStore,
    useTitleHook,
} from "../../hooks";
import { IconBeach } from "@tabler/icons-react";

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

    const datos_reserva = activarDepartamento?.reserva
        ? {
              numero_departamento: activarDepartamento.numero_departamento,
              codigo_reserva: activarDepartamento.reserva.codigo_reserva,
              reserva_id: activarDepartamento.reserva.id,
              huesped: activarDepartamento.reserva.huesped,
              fecha_checkin: activarDepartamento.reserva.fecha_checkin,
              fecha_checkout: activarDepartamento.reserva.fecha_checkout,
              total_noches: activarDepartamento.reserva.total_noches,
          }
        : activarEstadia
        ? {
              codigo_reserva: activarEstadia.codigo_reserva,
              reserva_id: activarEstadia.id,
              huesped: activarEstadia.huesped,
              fecha_checkin: activarEstadia.fecha_checkin,
              fecha_checkout: activarEstadia.fecha_checkout,
              total_noches: activarEstadia.total_noches,
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

    return (
        <Container size="xl" my={20}>
            <Group justify="space-between">
                <TitlePage order={2}>Disponibilidad</TitlePage>
                <BtnSection
                    IconSection={IconBeach}
                    handleAction={() => console.log("estadia")}
                >
                    Agregar Estadia
                </BtnSection>
            </Group>

            <Divider my={10} />

            <FiltroDisponibilidad
                titulo="Buscar disponibilidad"
                fnHandleAction={fnConsultarDisponibilidadDepartamentos}
            />

            <Tabs
                defaultValue="HOSPEDAJE"
                mt="md"
                onChange={(value) => {
                    if (value === "HOSPEDAJE")
                        fnConsultarDisponibilidadDepartamentos();
                    if (value === "ESTADIA") fnCargarEstadias();
                }}
            >
                <Tabs.List grow>
                    <Tabs.Tab value="HOSPEDAJE">Hospedajes</Tabs.Tab>
                    <Tabs.Tab value="ESTADIA">Estadías</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="HOSPEDAJE" pt="xs">
                    {cargandoDepartamentos ? (
                        <Group gap={20}>
                            <Skeleton
                                height={80}
                                mt={6}
                                width="30%"
                                radius="md"
                            />
                            <Skeleton
                                height={80}
                                mt={6}
                                width="30%"
                                radius="md"
                            />
                            <Skeleton
                                height={80}
                                mt={6}
                                width="30%"
                                radius="md"
                            />
                        </Group>
                    ) : (
                        <DepartamentosDisponiblesCards />
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="ESTADIA" pt="xs">
                    {cargandoEstadias ? (
                        <Group gap={20}>
                            <Skeleton
                                height={80}
                                mt={6}
                                width="30%"
                                radius="md"
                            />
                            <Skeleton
                                height={80}
                                mt={6}
                                width="30%"
                                radius="md"
                            />
                            <Skeleton
                                height={80}
                                mt={6}
                                width="30%"
                                radius="md"
                            />
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
                    <ConsumoModal reserva_id={datos_reserva.reserva_id} />
                    <ReservaFinalizarModal datos_reserva={datos_reserva} />
                </>
            )}

            <GastoModal />
            <ConsumoEditarModal />
            <ConsumoEliminarModal />
        </Container>
    );
};

export default DisponibilidadDepartamentoPage;

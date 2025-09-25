import { useEffect } from "react";
import { Container, Divider, Group, Skeleton } from "@mantine/core";
import {
    BtnSection,
    ConsumoEditarModal,
    ConsumoEliminarModal,
    ConsumoModal,
    ConsumosDrawer,
    DepartamentosDisponiblesCards,
    FiltroDisponibilidad,
    GastoModal,
    ReservaFinalizarModal,
    ReservarDepartamentoModal,
    TitlePage,
} from "../../components";
import { useDepartamentoStore, useTitleHook } from "../../hooks";
import { IconBeach } from "@tabler/icons-react";

const DisponibilidadDepartamentoPage = () => {
    useTitleHook("Disponibilidad - Mansion Real");
    const {
        cargando,
        fnAsignarDepartamento,
        activarDepartamento,
        fnConsultarDisponibilidadDepartamentos,
        fnLimpiarDepartamentos,
    } = useDepartamentoStore();

    const datos_reserva = {
        numero_departamento: activarDepartamento?.numero_departamento,
        codigo_reserva: activarDepartamento?.reserva?.codigo_reserva,
        reserva_id: activarDepartamento?.reserva?.id,
        huesped: activarDepartamento?.reserva?.huesped,
        fecha_checkin: activarDepartamento?.reserva?.fecha_checkin,
        fecha_checkout: activarDepartamento?.reserva?.fecha_checkout,
        total_noches: activarDepartamento?.reserva?.total_noches,
    };

    useEffect(() => {
        fnConsultarDisponibilidadDepartamentos();
        return () => {
            fnLimpiarDepartamentos();
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
                cargando={cargando}
            />
            {cargando ? (
                <Group gap={20}>
                    <Skeleton height={80} mt={6} width="30%" radius="md" />
                    <Skeleton height={80} mt={6} width="30%" radius="md" />
                    <Skeleton height={80} mt={6} width="30%" radius="md" />
                </Group>
            ) : (
                <DepartamentosDisponiblesCards />
            )}

            <ReservarDepartamentoModal />
            <ConsumosDrawer
                datos_reserva={datos_reserva}
                fnAsignarElemento={fnAsignarDepartamento}
            />
            <ConsumoModal reserva_id={datos_reserva.reserva_id} />
            <GastoModal />
            <ReservaFinalizarModal datos_reserva={datos_reserva} />

            <ConsumoEditarModal />
            <ConsumoEliminarModal />
        </Container>
    );
};

export default DisponibilidadDepartamentoPage;

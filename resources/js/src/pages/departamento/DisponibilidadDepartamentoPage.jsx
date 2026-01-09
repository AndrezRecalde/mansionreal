import { useEffect, useMemo } from "react";
import { Container, Divider, Tabs } from "@mantine/core";
import {
    TitlePage,
    LimpiezaModal,
    TabContentDisponibilidad,
    ReservaModals,
} from "../../components";
import {
    useDepartamentoStore,
    useEstadiaStore,
    useTitleHook,
    useDatosReservaDisponibilidad,
    useDisponibilidadTabManagement,
    usePagoStore,
    useConsumoStore,
    useGastoStore,
} from "../../hooks";
import { PAGE_CONFIG, TABS } from "../../helpers/calendario.constants";
import classes from "./modules/Tabs.module.css";
import Swal from "sweetalert2";

/**
 * Página de disponibilidad de departamentos
 * Muestra los departamentos disponibles y las estadías reservadas
 * Permite gestionar reservas, pagos, consumos y limpieza
 */
const DisponibilidadDepartamentoPage = () => {
    // Configuración inicial
    useTitleHook(PAGE_CONFIG.DISPONIBILIDAD.TITLE);
    const usuario = JSON.parse(localStorage.getItem("service_user") || "{}");

    // Stores
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
        fnAsignarEstadia,
        fnLimpiarEstadias,
    } = useEstadiaStore();

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
                icon: erroresGastos.status,
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
                icon: erroresConsumos.status,
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
                icon: erroresPagos.status,
                text: erroresPagos,
                showConfirmButton: true,
            });
        }
    }, [erroresPagos]);

    // Hooks personalizados - Ahora retorna también activeTab
    const { activeTab, handleTabChange } = useDisponibilidadTabManagement(
        fnConsultarDisponibilidadDepartamentos,
        fnCargarEstadias
    );

    const datos_reserva = useDatosReservaDisponibilidad(
        activarDepartamento,
        activarEstadia
    );

    // Memoizar la función según el tab activo
    const fnAsignarElemento = useMemo(() => {
        return activeTab === TABS.HOSPEDAJE
            ? fnAsignarDepartamento
            : fnAsignarEstadia;
    }, [activeTab, fnAsignarDepartamento, fnAsignarEstadia]);

    useEffect(() => {
        fnConsultarDisponibilidadDepartamentos();

        return () => {
            fnLimpiarDepartamentos();
            fnLimpiarEstadias();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container
            size={PAGE_CONFIG.DISPONIBILIDAD.CONTAINER_SIZE}
            my={PAGE_CONFIG.DISPONIBILIDAD.MARGIN_Y}
        >
            <TitlePage order={2}>{PAGE_CONFIG.DISPONIBILIDAD.TITLE}</TitlePage>

            <Divider my={PAGE_CONFIG.DISPONIBILIDAD.DIVIDER_MARGIN} />

            <Tabs
                variant="unstyled"
                value={activeTab}
                mt="md"
                onChange={handleTabChange}
                classNames={classes}
            >
                <Tabs.List grow>
                    <Tabs.Tab value={TABS.HOSPEDAJE}>Hospedajes</Tabs.Tab>
                    <Tabs.Tab value={TABS.ESTADIA}>Estadías</Tabs.Tab>
                </Tabs.List>

                <TabContentDisponibilidad
                    cargandoDepartamentos={cargandoDepartamentos}
                    cargandoEstadias={cargandoEstadias}
                    usuario={usuario}
                />
            </Tabs>

            <ReservaModals
                datos_reserva={datos_reserva}
                fnAsignarDepartamento={fnAsignarElemento}
            />
            <LimpiezaModal />
        </Container>
    );
};

export default DisponibilidadDepartamentoPage;

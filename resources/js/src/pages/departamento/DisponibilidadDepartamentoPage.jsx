import { useEffect } from "react";
import { Container, Divider } from "@mantine/core";
import {
    LimpiezaModal,
    TabContentDisponibilidad,
    ReservaModals,
    PrincipalSectionPage,
} from "../../components";
import {
    useDepartamentoStore,
    useTitleHook,
    useDatosReservaDisponibilidad,
    usePagoStore,
    useConsumoStore,
    useGastoStore,
} from "../../hooks";
import { PAGE_CONFIG } from "../../helpers/calendario.constants";
import { PAGE_TITLE } from "../../helpers/getPrefix";
import Swal from "sweetalert2";
import { IconBuildingSkyscraper } from "@tabler/icons-react";

/**
 * Página de disponibilidad de departamentos (solo HOSPEDAJE)
 * Muestra los departamentos disponibles y permite gestionar reservas, pagos, consumos y limpieza
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

    const { mensaje: mensajePagos, errores: erroresPagos } = usePagoStore();
    const { mensaje: mensajeConsumos, errores: erroresConsumos } = useConsumoStore();
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

    const datos_reserva = useDatosReservaDisponibilidad(activarDepartamento);

    useEffect(() => {
        fnConsultarDisponibilidadDepartamentos();

        return () => {
            fnLimpiarDepartamentos();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container
            size={PAGE_CONFIG.DISPONIBILIDAD.CONTAINER_SIZE}
            my={PAGE_CONFIG.DISPONIBILIDAD.MARGIN_Y}
        >
            <PrincipalSectionPage
                title={PAGE_CONFIG.DISPONIBILIDAD.TITLE}
                description={PAGE_CONFIG.DISPONIBILIDAD.DESCRIPCION_PAGE}
                icon={<IconBuildingSkyscraper size={22} />}
            />
            <Divider my={PAGE_CONFIG.DISPONIBILIDAD.DIVIDER_MARGIN} />

            <TabContentDisponibilidad
                cargandoDepartamentos={cargandoDepartamentos}
                usuario={usuario}
            />

            <ReservaModals
                datos_reserva={datos_reserva}
                fnAsignarDepartamento={fnAsignarDepartamento}
            />
            <LimpiezaModal PAGE_TITLE={PAGE_TITLE.LIMPIEZA.CAMPOS_MODAL} />
        </Container>
    );
};

export default DisponibilidadDepartamentoPage;

import { useEffect } from "react";
import { Container, Divider } from "@mantine/core";
import {
    ActivarElementoModal,
    ConfigIvaModal,
    ConfigIvaTable,
    TitlePage,
} from "../../components";
import { useConfiguracionIvaStore, useUiConfiguracionIva } from "../../hooks";
import { IconCubePlus } from "@tabler/icons-react";
import Swal from "sweetalert2";

const ConfigIvaPage = () => {
    const {
        fnCargarIvas,
        activarIva,
        fnAsignarIva,
        fnActualizarStatusIva,
        fnLimpiarIvas,
        mensaje,
        errores,
    } = useConfiguracionIvaStore();

    const {
        abrirModalActivarConfiguracionIva,
        fnModalAbrirActivarConfiguracionIva,
    } = useUiConfiguracionIva();

    useEffect(() => {
        fnCargarIvas({});

        return () => {
            fnLimpiarIvas();
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
        <Container size="lg" my={20}>
            <TitlePage order={2}>Configuracion del Iva</TitlePage>
            <Divider my={10} />

            <ConfigIvaTable />

            <ConfigIvaModal />
            <ActivarElementoModal
                titulo="Activar Iva"
                fnAbrirModal={fnModalAbrirActivarConfiguracionIva}
                abrirModal={abrirModalActivarConfiguracionIva}
                elementoActivado={activarIva}
                fnAsignarElementoActivado={fnAsignarIva}
                IconSection={IconCubePlus}
                fnHandleAction={fnActualizarStatusIva}
            />
        </Container>
    );
};

export default ConfigIvaPage;

import { useEffect } from "react";
import { Container, Divider } from "@mantine/core";
import {
    ActivarElementoModal,
    ConfigIvaModal,
    ConfigIvaTable,
    TitlePage,
} from "../../components";
import {
    useConfiguracionIvaStore,
    useTitleHook,
    useUiConfiguracionIva,
} from "../../hooks";
import { IconCubePlus } from "@tabler/icons-react";
import { PAGE_TITLE } from "../../helpers/getPrefix";
import Swal from "sweetalert2";

const ConfigIvaPage = () => {
    useTitleHook(PAGE_TITLE.IVA.TITLE);
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
        <Container size="xl" my={20}>
            <TitlePage order={2}>{PAGE_TITLE.IVA.TITLE_PAGE}</TitlePage>
            <Divider my={10} />

            <ConfigIvaTable PAGE_TITLE={PAGE_TITLE.IVA.CAMPOS_TABLA} />

            <ConfigIvaModal PAGE_TITLE={PAGE_TITLE.IVA.CAMPOS_MODAL} />
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

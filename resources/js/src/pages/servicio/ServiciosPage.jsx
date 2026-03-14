import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    BtnSection,
    PrincipalSectionPage,
    ServicioModal,
    ServicioTable,
} from "../../components";
import { IconCategory2, IconCubePlus } from "@tabler/icons-react";
import { useServicioStore, useTitleHook, useUiServicio } from "../../hooks";
import { PAGE_TITLE } from "../../helpers/getPrefix";
import Swal from "sweetalert2";

const ServiciosPage = () => {
    useTitleHook(PAGE_TITLE.SERVICIOS.TITLE);
    const { fnCargarServicios, fnLimpiarServicios, mensaje, errores } =
        useServicioStore();
    const { fnModalAbrirServicio } = useUiServicio();

    useEffect(() => {
        fnCargarServicios();

        return () => {
            fnLimpiarServicios();
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

    const handleNuevoServicio = () => {
        fnModalAbrirServicio(true);
    };

    return (
        <Container size="xl" my={20}>
            <Group justify="space-between" mb={10}>
                <PrincipalSectionPage
                    title={PAGE_TITLE.SERVICIOS.TITLE_PAGE}
                    description={PAGE_TITLE.SERVICIOS.DESCRIPCION_PAGE}
                    icon={<IconCategory2 size={22} />}
                />
                <BtnSection
                    IconSection={IconCubePlus}
                    handleAction={handleNuevoServicio}
                >
                    {PAGE_TITLE.SERVICIOS.BUTTONS.NUEVO_SERVICIO}
                </BtnSection>
            </Group>
            <Divider my={10} />
            <ServicioTable PAGE_TITLE={PAGE_TITLE.SERVICIOS} />

            <ServicioModal PAGE_TITLE={PAGE_TITLE.SERVICIOS} />
        </Container>
    );
};

export default ServiciosPage;

import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    BtnSection,
    ServicioModal,
    ServicioTable,
    TitlePage,
} from "../../components";
import { IconCubePlus } from "@tabler/icons-react";
import { useServicioStore, useTitleHook, useUiServicio } from "../../hooks";
import Swal from "sweetalert2";

const ServiciosPage = () => {
    useTitleHook("Servicios - Mansión Real");
    const { fnCargarServicios, fnLimpiarServicios, mensaje, errores } = useServicioStore();
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
        <Container size="lg" my={20}>
            <Group justify="space-between" mb={10}>
                <TitlePage>Servicios</TitlePage>
                <BtnSection
                    IconSection={IconCubePlus}
                    handleAction={handleNuevoServicio}
                >
                    Nuevo Servicio
                </BtnSection>
            </Group>
            <Divider my={10} />
            <ServicioTable />

            <ServicioModal />
        </Container>
    );
};

export default ServiciosPage;

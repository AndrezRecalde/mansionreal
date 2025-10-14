import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    BtnSection,
    HuespedModal,
    TitlePage,
    HuespedTable,
} from "../../components";
import { useHuespedStore, useProvinciaStore, useUiHuesped } from "../../hooks";
import { IconCubePlus } from "@tabler/icons-react";
import Swal from "sweetalert2";

const HuespedPage = () => {
    const { fnCargarHuespedes, fnLimpiarHuespedes, mensaje, errores } =
        useHuespedStore();
    const { fnModalHuesped } = useUiHuesped();
    const { fnCargarProvincias, fnLimpiarProvincias } = useProvinciaStore();

    const handleNuevoHuesped = () => {
        fnModalHuesped(true);
    };

    useEffect(() => {
        fnCargarHuespedes();
        fnCargarProvincias();

        return () => {
            fnLimpiarHuespedes();
            fnLimpiarProvincias();
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
            <Group justify="space-between" mb={10}>
                <TitlePage>Huespedes</TitlePage>
                <BtnSection
                    IconSection={IconCubePlus}
                    handleAction={handleNuevoHuesped}
                >
                    Nuevo Huesped
                </BtnSection>
            </Group>
            <Divider my={10} />
            <HuespedTable />

            <HuespedModal />
        </Container>
    );
};

export default HuespedPage;

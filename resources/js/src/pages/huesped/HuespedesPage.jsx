import { useEffect, useState } from "react";
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

    // Estado local para controlar la paginación
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    useEffect(() => {
        fnCargarProvincias();

        return () => {
            fnLimpiarHuespedes();
            fnLimpiarProvincias();
        };
    }, []);

    // Cargar huéspedes cuando cambia la paginación local
    useEffect(() => {
        fnCargarHuespedes({
            page: pagination.pageIndex + 1, // Backend usa base 1
            per_page: pagination.pageSize,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, pagination.pageSize]);

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
            <HuespedTable
                pagination={pagination}
                setPagination={setPagination}
            />

            <HuespedModal />
        </Container>
    );
};

export default HuespedPage;

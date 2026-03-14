import { useEffect, useState } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    BtnSection,
    HuespedModal,
    HuespedTable,
    PrincipalSectionPage,
} from "../../components";
import { useHuespedStore, useTitleHook, useUiHuesped } from "../../hooks";
import { IconCubePlus, IconUsersGroup } from "@tabler/icons-react";
import Swal from "sweetalert2";
import { PAGE_TITLE } from "../../helpers/getPrefix";

const HuespedPage = () => {
    useTitleHook(PAGE_TITLE.HUESPEDES.TITLE);
    const { fnCargarHuespedes, fnLimpiarHuespedes, mensaje, errores } =
        useHuespedStore();
    const { fnModalHuesped } = useUiHuesped();

    const handleNuevoHuesped = () => {
        fnModalHuesped(true);
    };

    // Estado local para controlar la paginación
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    useEffect(() => {
        return () => {
            fnLimpiarHuespedes();
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
                <PrincipalSectionPage
                    title={PAGE_TITLE.HUESPEDES.TITLE_PAGE}
                    description={PAGE_TITLE.HUESPEDES.DESCRIPCION_PAGE}
                    icon={<IconUsersGroup size={22} />}
                />

                <BtnSection
                    IconSection={IconCubePlus}
                    handleAction={handleNuevoHuesped}
                >
                    {PAGE_TITLE.HUESPEDES.BUTTONS.NUEVO_HUESPED}
                </BtnSection>
            </Group>
            <Divider my={10} />
            <HuespedTable
                pagination={pagination}
                setPagination={setPagination}
                PAGE_TITLE={PAGE_TITLE}
            />

            <HuespedModal PAGE_TITLE={PAGE_TITLE} />
        </Container>
    );
};

export default HuespedPage;

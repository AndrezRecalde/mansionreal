import { useEffect } from "react";
import { Container, Paper, Group } from "@mantine/core";
import { IconCash, IconCubePlus } from "@tabler/icons-react";
import { BtnSection, PrincipalSectionPage } from "../../components";
import { useCajasStore, useTitleHook } from "../../hooks";
import { CajasTable } from "../../components/cajas/table/CajasTable";
import { CajaModal } from "../../components/cajas/modal/CajaModal";
import Swal from "sweetalert2";

const CajasPage = () => {
    useTitleHook("Administración de Cajas - Mansión Real");
    const { fnCargarCajasCRUD, setModalCajaCRUD, setActivaCaja, mensaje, errores } =
        useCajasStore();

    useEffect(() => {
        fnCargarCajasCRUD();
    }, []);

    useEffect(() => {
        if (mensaje !== undefined) {
            Swal.fire({
                icon: mensaje?.status || "success",
                text: mensaje?.msg || (typeof mensaje === 'string' ? mensaje : "Operación Exitosa"),
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

    const onAdd = () => {
        setActivaCaja(null);
        setModalCajaCRUD(true);
    };

    return (
        <Container size="xl" my="md">
            <Group justify="space-between" align="center" mb="md">
                <PrincipalSectionPage
                    title="Administración de Cajas Físicas"
                    description="Administración de cajas físicas"
                    icon={<IconCash size={24} />}
                />

                <BtnSection IconSection={IconCubePlus} handleAction={onAdd}>
                    Nueva Caja
                </BtnSection>
            </Group>

            <Paper shadow="sm" radius="md" withBorder>
                <CajasTable />
            </Paper>

            <CajaModal />
        </Container>
    );
};
export default CajasPage;

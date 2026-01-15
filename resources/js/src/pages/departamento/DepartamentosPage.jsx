import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    ActivarElementoModal,
    BtnSection,
    DepartamentoDrawer,
    DepartamentoModal,
    DepartamentoTable,
    TitlePage,
} from "../../components";
import { IconBuilding, IconCubePlus } from "@tabler/icons-react";
import { useDepartamentoStore, useTitleHook, useUiDepartamento } from "../../hooks";
import Swal from "sweetalert2";

const DepartamentosPage = () => {
    useTitleHook("Departamentos - Mansion Real");
    const {
        fnModalAbrirDepartamento,
        fnModalAbrirActivarDepartamento,
        abrirModalActivarDepartamento,
    } = useUiDepartamento();
    const {
        mensaje,
        errores,
        fnCargarDepartamentos,
        activarDepartamento,
        fnAsignarDepartamento,
        fnLimpiarDepartamentos,
    } = useDepartamentoStore();

    useEffect(() => {
        fnCargarDepartamentos();

        return () => {
            fnLimpiarDepartamentos();
        };
    }, []);

    useEffect(() => {
        if (mensaje !== undefined) {
            Swal.fire({
                icon: mensaje.status,
                text: mensaje.msg,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }, [mensaje]);

    useEffect(() => {
        if (errores) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: errores,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }, [errores]);

    const handleNuevoDepartamento = () => {
        fnModalAbrirDepartamento(true);
    };

    return (
        <Container size="xl" my={20}>
            <Group justify="space-between" mb={10}>
                <TitlePage>Departamentos</TitlePage>
                <BtnSection
                    IconSection={IconCubePlus}
                    handleAction={handleNuevoDepartamento}
                >
                    Nuevo Departamento
                </BtnSection>
            </Group>
            <Divider my={10} />
            <DepartamentoTable />

            <DepartamentoModal />
            <DepartamentoDrawer />
            <ActivarElementoModal
                titulo="Activar Departamento"
                fnAbrirModal={fnModalAbrirActivarDepartamento}
                abrirModal={abrirModalActivarDepartamento}
                elementoActivado={activarDepartamento}
                fnAsignarElementoActivado={fnAsignarDepartamento}
                IconSection={IconBuilding}
                fnHandleAction={() => {}}
            />
        </Container>
    );
};

export default DepartamentosPage;

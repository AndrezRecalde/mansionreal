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
import { PAGE_TITLE } from "../../helpers/getPrefix";
import Swal from "sweetalert2";

const DepartamentosPage = () => {
    useTitleHook(PAGE_TITLE.DEPARTAMENTOS.TITLE);
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
                <TitlePage>{PAGE_TITLE.DEPARTAMENTOS.TITLE_PAGE}</TitlePage>
                <BtnSection
                    IconSection={IconCubePlus}
                    handleAction={handleNuevoDepartamento}
                >
                    {PAGE_TITLE.DEPARTAMENTOS.BUTTONS.NUEVO_DEPARTAMENTO}
                </BtnSection>
            </Group>
            <Divider my={10} />
            <DepartamentoTable />

            <DepartamentoModal PAGE_TITLE={PAGE_TITLE.DEPARTAMENTOS.CAMPOS_MODAL} />
            <DepartamentoDrawer />
            <ActivarElementoModal
                titulo={PAGE_TITLE.DEPARTAMENTOS.ACTIVAR_ELEMENTO.TITLE}
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

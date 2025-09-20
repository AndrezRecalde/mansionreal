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
import { useDepartamentoStore, useUiDepartamento } from "../../hooks";

const DepartamentosPage = () => {
    const {
        fnModalAbrirDepartamento,
        fnModalAbrirActivarDepartamento,
        abrirModalActivarDepartamento,
    } = useUiDepartamento();
    const {
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

import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    ActivarElementoModal,
    BtnSection,
    CategoriaModal,
    CategoriaTable,
    TitlePage,
} from "../../components";
import { useCategoriaStore, useTitleHook, useUiCategoria } from "../../hooks";
import { PAGE_TITLE } from "../../helpers/getPrefix";
import { IconCubePlus } from "@tabler/icons-react";
import Swal from "sweetalert2";

const CategoriasPage = () => {
    useTitleHook(PAGE_TITLE.CATEGORIAS);
    const {
        activarCategoria,
        fnCargarCategorias,
        fnAsignarCategoria,
        fnActualizarStatusCategoria,
        fnLimpiarCategorias,
        mensaje,
        errores,
    } = useCategoriaStore();
    const {
        fnModalAbrirCategoria,
        fnModalAbrirActivarCategoria,
        abrirModalActivarCategoria,
    } = useUiCategoria();

    useEffect(() => {
        fnCargarCategorias({});

        return () => {
            fnLimpiarCategorias();
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

    const handleNuevaCategoria = () => {
        fnModalAbrirCategoria(true);
    };

    return (
        <Container size="xl" my={20}>
            <Group justify="space-between" mb={10}>
                <TitlePage>Categorias</TitlePage>
                <BtnSection
                    IconSection={IconCubePlus}
                    handleAction={handleNuevaCategoria}
                >
                    Nueva Categoria
                </BtnSection>
            </Group>
            <Divider my={10} />
            <CategoriaTable />

            <CategoriaModal />
            <ActivarElementoModal
                titulo="Activar Categoria"
                fnAbrirModal={fnModalAbrirActivarCategoria}
                abrirModal={abrirModalActivarCategoria}
                elementoActivado={activarCategoria}
                fnAsignarElementoActivado={fnAsignarCategoria}
                IconSection={IconCubePlus}
                fnHandleAction={fnActualizarStatusCategoria}
            />
        </Container>
    );
};

export default CategoriasPage;

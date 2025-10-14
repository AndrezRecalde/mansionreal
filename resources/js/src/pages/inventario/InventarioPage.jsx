import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    ActivarElementoModal,
    BtnSection,
    InventarioBusquedaForm,
    InventarioModal,
    InventarioTable,
    TitlePage,
} from "../../components";
import {
    useCategoriaStore,
    useInventarioStore,
    useTitleHook,
    useUiInventario,
} from "../../hooks";
import { IconCubePlus } from "@tabler/icons-react";
import Swal from "sweetalert2";

const InventarioPage = () => {
    useTitleHook("Inventario - Mansión Real");

    const {
        activarInventario,
        fnAsignarProductoInventario,
        fnActualizarStatusProductoInventario,
        mensaje,
        errores,
    } = useInventarioStore();
    const {
        fnModalInventario,
        fnModalAbrirActivarInventario,
        abrirModalActivarProductoInventario,
    } = useUiInventario();
    const { fnCargarCategorias, fnLimpiarCategorias } = useCategoriaStore();

    useEffect(() => {
        fnCargarCategorias({ activo: 1 });

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

    const handleNuevoHuesped = () => {
        fnModalInventario(true);
    };

    return (
        <Container size="xl" my={20}>
            <Group justify="space-between" mb={10}>
                <TitlePage order={2}>Inventario — Productos</TitlePage>
                <BtnSection
                    IconSection={IconCubePlus}
                    handleAction={handleNuevoHuesped}
                >
                    Nuevo Producto
                </BtnSection>
            </Group>
            <Divider my={10} />
            <InventarioBusquedaForm />
            <InventarioTable />

            <InventarioModal />

            <ActivarElementoModal
                titulo="Activar Inventario"
                fnAbrirModal={fnModalAbrirActivarInventario}
                abrirModal={abrirModalActivarProductoInventario}
                elementoActivado={activarInventario}
                fnAsignarElementoActivado={fnAsignarProductoInventario}
                IconSection={IconCubePlus}
                fnHandleAction={fnActualizarStatusProductoInventario}
            />
        </Container>
    );
};

export default InventarioPage;

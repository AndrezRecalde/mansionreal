import { Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { CategoriaForm, TextSection } from "../../../components";
import { useForm } from "@mantine/form";
import { useCategoriaStore, useUiCategoria } from "../../../hooks";

export const CategoriaModal = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { abrirModalCategoria, fnModalAbrirCategoria } = useUiCategoria();
    const { fnAsignarCategoria } = useCategoriaStore();

    const form = useForm({
        initialValues: {
            nombre_categoria: "",
        },
        validate: {
            nombre_categoria: (value) =>
                value.length < 3
                    ? "El nombre de la categoria debe tener al menos 3 caracteres"
                    : null,
        },
    });

    const handleCerrarModal = () => {
        fnModalAbrirCategoria(false);
        fnAsignarCategoria(null);
        form.reset();
    };

    return (
        <Modal
            centered
            fullScreen={isMobile}
            opened={abrirModalCategoria}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fz={16} fw={700}>
                    Categoria
                </TextSection>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <CategoriaForm form={form} />
        </Modal>
    );
};

import { Modal } from "@mantine/core";
import { TextSection } from "../../../components";
import { ActivarElementoForm } from "./ActivarElementoForm";
import { isNotEmpty, useForm } from "@mantine/form";

export const ActivarElementoModal = ({
    titulo,
    fnAbrirModal,
    abrirModal,
    elementoActivado,
    fnAsignarElementoActivado,
    IconSection,
    fnHandleAction,
}) => {
    const form = useForm({
        initialValues: {
            id: null,
            activo: null,
            nombre: "",
        },
        validate: {
            activo: isNotEmpty("Por favor ingrese un estado para el elemento"),
        },
        //Quitar la propiedad nombre del form
        transformValues: (values) => {
            const { nombre, ...rest } = values;
            return rest;
        },
    });

    const handleCerrarModal = () => {
        fnAbrirModal(false);
        fnAsignarElementoActivado(null);
    };

    return (
        <Modal
            centered
            opened={abrirModal}
            onClose={handleCerrarModal}
            title={
                <TextSection tt="" fw={700} fz={16}>
                    {titulo}
                </TextSection>
            }
            size="md"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <ActivarElementoForm
                form={form}
                elementoActivado={elementoActivado}
                fnAsignarElementoActivado={fnAsignarElementoActivado}
                IconSection={IconSection}
                fnAbrirModal={fnAbrirModal}
                fnHandleAction={fnHandleAction}
            />
        </Modal>
    );
};

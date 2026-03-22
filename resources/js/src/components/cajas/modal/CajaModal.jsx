import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Modal, TextInput, Stack, Group, Textarea } from "@mantine/core";
import { useCajasStore } from "../../../hooks";
import { BtnSection, BtnSubmit } from "../../elements/buttons/BtnServices";
import Swal from "sweetalert2";

export const CajaModal = () => {
    const {
        cargando,
        activaCaja,
        isCajaModalOpen,
        fnCrearCaja,
        fnActualizarCaja,
        setModalCajaCRUD,
        setActivaCaja,
    } = useCajasStore();

    const form = useForm({
        initialValues: {
            nombre: "",
            descripcion: "",
        },
        validate: {
            nombre: (value) =>
                value?.trim().length < 3
                    ? "El nombre debe tener al menos 3 caracteres"
                    : null,
        },
    });

    useEffect(() => {
        if (activaCaja) {
            form.setValues({
                nombre: activaCaja.nombre || "",
                descripcion: activaCaja.descripcion || "",
            });
        } else {
            form.reset();
        }
    }, [activaCaja, isCajaModalOpen]);

    const onClose = () => {
        setModalCajaCRUD(false);
        setActivaCaja(null);
        form.reset();
    };

    const handleSubmit = async (values) => {
        let res;
        if (activaCaja?.id) {
            res = await fnActualizarCaja(activaCaja.id, values);
        } else {
            res = await fnCrearCaja({ ...values, activa: 1 });
        }

        if (res) {
            Swal.fire({
                icon: res.status ? "success" : "error",
                title: res.status ? "Éxito" : "Error",
                text: res.msg || (res.status ? "Transacción completada" : "Ocurrió un error inesperado"),
                timer: 2000,
                showConfirmButton: false,
            });

            if (res.status) {
                onClose();
            }
        }
    };

    return (
        <Modal
            opened={isCajaModalOpen}
            onClose={onClose}
            title={
                activaCaja?.id
                    ? "Editar Caja Físicamente"
                    : "Registrar Nueva Caja"
            }
            centered
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <TextInput
                        withAsterisk
                        label="Nombre de la Caja / Estación"
                        placeholder="Ej. Caja Principal, Caja Restaurante..."
                        {...form.getInputProps("nombre")}
                    />
                    <Textarea
                        label="Descripción / Ubicación (Opcional)"
                        placeholder="Ej. Ubicada en el lobby, gaveta color gris..."
                        {...form.getInputProps("descripcion")}
                    />

                    <Group justify="flex-end" mt="md">
                        <BtnSection disabled={cargando} handleAction={onClose}>
                            Cancelar
                        </BtnSection>
                        <BtnSubmit
                            heigh={40}
                            fontSize={14}
                            fullwidth={false}
                            loading={cargando}
                        >
                            Guardar
                        </BtnSubmit>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};

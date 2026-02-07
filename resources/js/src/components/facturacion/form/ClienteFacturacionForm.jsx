import { useEffect } from "react";
import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useClienteFacturacionStore } from "../../../hooks";
import Swal from "sweetalert2";

export const ClienteFacturacionForm = ({
    dniBusqueda = "",
    datosPrellenados,
    onClienteCreado,
    onCancelar,
}) => {
    const { cargando, fnCrearCliente } = useClienteFacturacionStore();

    const form = useForm({
        initialValues: {
            tipo_identificacion: "",
            identificacion: dniBusqueda,
            nombres_completos: "",
            direccion: "",
            telefono: "",
            email: "",
        },
        validate: {
            tipo_identificacion: (value) =>
                value ? null : "Seleccione el tipo de identificación",
            identificacion: (value) =>
                value?.trim() ? null : "La identificación es obligatoria",
            nombres_completos: (value) =>
                value?.trim() ? null : "El nombre completo es obligatorio",
        },
    });

    // Prellenar formulario si hay datos
    useEffect(() => {
        if (datosPrellenados) {
            form.setValues({
                tipo_identificacion: datosPrellenados.tipo_identificacion || "",
                identificacion: datosPrellenados.identificacion || "",
                nombres_completos: datosPrellenados.nombres_completos || "",
                direccion: datosPrellenados.direccion || "",
                telefono: datosPrellenados.telefono || "",
                email: datosPrellenados.email || "",
            });
        }
    }, [datosPrellenados]);

    const handleSubmit = async (values) => {
        try {
            const nuevoCliente = await fnCrearCliente({
                ...values,
                tipo_cliente: "CLIENTE_REGISTRADO",
                activo: true,
            });

            if (nuevoCliente) {
                Swal.fire({
                    icon: "success",
                    title: "¡Cliente creado!",
                    text: "El cliente ha sido registrado exitosamente.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                onClienteCreado(nuevoCliente);
                form.reset();
            }
        } catch (error) {
            //console.error("Error al crear cliente:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al crear el cliente. Por favor, intente nuevamente.",
            });
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
                <Select
                    label="Tipo de Identificación"
                    placeholder="Seleccione"
                    data={[
                        { value: "CEDULA", label: "Cédula" },
                        { value: "RUC", label: "RUC" },
                        { value: "PASAPORTE", label: "Pasaporte" },
                    ]}
                    withAsterisk
                    {...form.getInputProps("tipo_identificacion")}
                />

                <TextInput
                    label="Número de Identificación"
                    placeholder="Ej: 1712345678"
                    withAsterisk
                    {...form.getInputProps("identificacion")}
                />

                <Group grow>
                    <TextInput
                        label="Nombres Completos"
                        placeholder="Nombres Completos"
                        withAsterisk
                        {...form.getInputProps("nombres_completos")}
                    />
                </Group>

                <TextInput
                    label="Dirección"
                    placeholder="Dirección"
                    {...form.getInputProps("direccion")}
                />

                <Group grow>
                    <TextInput
                        label="Teléfono"
                        placeholder="0998765432"
                        {...form.getInputProps("telefono")}
                    />
                    <TextInput
                        label="Email"
                        placeholder="cliente@example.com"
                        type="email"
                        {...form.getInputProps("email")}
                    />
                </Group>

                <Group justify="flex-end" mt="md">
                    <Button
                        variant="subtle"
                        onClick={onCancelar}
                        leftSection={<IconX size={16} />}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        loading={cargando}
                        leftSection={<IconCheck size={16} />}
                    >
                        Crear Cliente
                    </Button>
                </Group>
            </Stack>
        </form>
    );
};

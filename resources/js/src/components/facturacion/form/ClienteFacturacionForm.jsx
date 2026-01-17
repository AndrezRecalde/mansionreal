import { useEffect } from "react";
import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useClienteFacturacionStore } from "../../../hooks";
import Swal from "sweetalert2";

export const ClienteFacturacionForm = ({
    datosPrellenados,
    onClienteCreado,
    onCancelar,
}) => {
    const { cargando, fnCrearCliente } = useClienteFacturacionStore();

    const form = useForm({
        initialValues: {
            tipo_identificacion: "",
            identificacion: "",
            nombres: "",
            apellidos: "",
            direccion: "",
            telefono: "",
            email: "",
        },
        validate: {
            tipo_identificacion: (value) =>
                value ? null : "Seleccione el tipo de identificación",
            identificacion: (value) =>
                value?.trim() ? null : "La identificación es obligatoria",
            nombres: (value) =>
                value?.trim() ? null : "El nombre es obligatorio",
            apellidos: (value) =>
                value?.trim() ? null : "Los apellidos son obligatorios",
        },
    });

    // Prellenar formulario si hay datos
    useEffect(() => {
        if (datosPrellenados) {
            form.setValues({
                tipo_identificacion: datosPrellenados.tipo_identificacion || "",
                identificacion: datosPrellenados.identificacion || "",
                nombres: datosPrellenados.nombres || "",
                apellidos: datosPrellenados.apellidos || "",
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
                        label="Nombres"
                        placeholder="Nombres"
                        withAsterisk
                        {...form.getInputProps("nombres")}
                    />
                    <TextInput
                        label="Apellidos"
                        placeholder="Apellidos"
                        withAsterisk
                        {...form.getInputProps("apellidos")}
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

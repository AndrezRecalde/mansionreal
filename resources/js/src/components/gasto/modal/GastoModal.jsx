import { useEffect } from "react";
import { Group, Modal, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { GastoForm } from "../../../components";
import {
    useGastoStore,
    useTiposDanoStore,
    useUiGasto,
} from "../../../hooks";
import { IconOutbound } from "@tabler/icons-react";

export const GastoModal = ( { activarElemento } ) => {
    const { abrirModalGasto, fnAbrirModalGasto } = useUiGasto();
    const { fnAsignarGasto } = useGastoStore();
    const { fnCargarTiposDano, fnLimpiarTiposDano } = useTiposDanoStore();

    const form = useForm({
        initialValues: {
            reserva_id: "",
            descripcion: "",
            monto: "",
            tipo_dano_id: "",
        },
        validate: {
            descripcion: (value) =>
                value.length < 5
                    ? "La descripción debe tener al menos 5 caracteres"
                    : null,
            monto: (value) =>
                isNaN(parseFloat(value)) || parseFloat(value) <= 0
                    ? "El monto debe ser un número positivo"
                    : null,
            tipo_dano_id: (value) =>
                value === null ? "Debe seleccionar un tipo de daño" : null,
        },
        transformValues: (values) => ({
            ...values,
            reserva_id: activarElemento.reserva_id
                ? parseInt(activarElemento.reserva_id)
                : null, // PONERLE OJO A ESTO
            tipo_dano_id: values.tipo_dano_id
                ? parseInt(values.tipo_dano_id)
                : null,
            monto: parseFloat(values.monto),
        }),
    });

    useEffect(() => {
        if (abrirModalGasto) {
            fnCargarTiposDano({ activo: true });
        }

        return () => {
            fnLimpiarTiposDano();
        };
    }, [abrirModalGasto]);

    const handleCerrarModal = () => {
        fnAbrirModalGasto(false);
        fnAsignarGasto(null);
        form.reset();
    };

    return (
        <Modal
            opened={abrirModalGasto}
            onClose={handleCerrarModal}
            title={
                <Group>
                    <Title order={4} fw={700}>
                        Registrar Pago de Daño
                    </Title>
                </Group>
            }
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            size="lg"
        >
            <GastoForm form={form} />
        </Modal>
    );
};

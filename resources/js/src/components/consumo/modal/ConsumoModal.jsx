import { useEffect } from "react";
import {
    Modal,
    Group,
    Stack,
    Text,
    Title,
    Divider,
    Box,
    rem,
} from "@mantine/core";
import { BtnSection, BtnSubmit, ConsumoCard } from "../../../components";
import { IconPlus } from "@tabler/icons-react";
import {
    useUiConsumo,
    useCategoriaStore,
    useInventarioStore,
    useConsumoStore,
    useConsumoForm,
    MAX_CONSUMOS,
    INITIAL_CONSUMO,
    MODAL_CONFIG,
} from "../../../hooks";
import Swal from "sweetalert2";

export function ConsumoModal({ reserva_id }) {
    const { abrirModalConsumo, fnAbrirModalConsumo } = useUiConsumo();
    const { fnCargarCategorias, fnLimpiarCategorias, categorias } =
        useCategoriaStore();
    const { fnCargarProductosInventario, fnLimpiarInventarios, inventarios } =
        useInventarioStore();
    const { fnAgregarConsumo } = useConsumoStore();

    const form = useConsumoForm();

    useEffect(() => {
        if (abrirModalConsumo) {
            form.setFieldValue("reserva_id", reserva_id);
            fnCargarCategorias({ activo: 1 });
        }
        return () => {
            fnLimpiarCategorias();
            fnLimpiarInventarios();
            form.reset();
        };
    }, [abrirModalConsumo, reserva_id]);

    const handleAddConsumo = () => {
        if (form.values.consumos.length < MAX_CONSUMOS) {
            form.insertListItem("consumos", { ...INITIAL_CONSUMO });
        }
    };

    const handleRemoveConsumo = (idx) => {
        form.removeListItem("consumos", idx);
    };

    const handleCategoriaChange = (idx, value) => {
        form.setFieldValue(`consumos.${idx}.categoria_id`, value || "");
        form.setFieldValue(`consumos.${idx}.inventario_id`, "");
        if (value) {
            fnCargarProductosInventario({ categoria_id: value, all: false, activo: 1 });
        } else {
            fnLimpiarInventarios();
        }
    };

    const handleSubmit = (values) => {
        Swal.fire({
            icon: "question",
            title: "¿Confirmar? ",
            text: "¿Desea registrar estos consumos?",
            showCancelButton: true,
            confirmButtonText: "Sí, registrar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                fnAgregarConsumo(values).then(() => {
                    fnAbrirModalConsumo(false);
                    form.reset();
                });
            }
        });
    };

    const handleCloseModal = () => {
        fnAbrirModalConsumo(false);
        form.reset();
    };

    const isMaxConsumos = form.values.consumos.length >= MAX_CONSUMOS;

    return (
        <Modal
            opened={abrirModalConsumo}
            onClose={handleCloseModal}
            size={MODAL_CONFIG.size}
            overlayProps={MODAL_CONFIG.overlayProps}
            title={
                <Group>
                    <Title order={4} fw={700}>
                        Registrar Consumo
                    </Title>
                </Group>
            }
        >
            <Box mb={rem(20)}>
                <Text mt={rem(5)} c="dimmed" size="sm">
                    Agrega hasta {MAX_CONSUMOS} consumos con categoría, producto
                    y cantidad.
                </Text>
            </Box>
            <Divider mb={rem(15)} />

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    {form.values.consumos.map((consumo, idx) => (
                        <ConsumoCard
                            key={idx}
                            consumo={consumo}
                            idx={idx}
                            categorias={categorias}
                            inventarios={inventarios}
                            form={form}
                            onRemove={handleRemoveConsumo}
                            onCategoriaChange={handleCategoriaChange}
                            canRemove={form.values.consumos.length > 1}
                        />
                    ))}

                    <Group>
                        <BtnSection
                            variant="light"
                            IconSection={IconPlus}
                            handleAction={handleAddConsumo}
                            disabled={isMaxConsumos}
                            color="indigo"
                            radius="sm"
                        >
                            Agregar consumo
                        </BtnSection>
                        <BtnSubmit fullwidth={false} height={40} fontSize={14}>
                            Guardar consumos
                        </BtnSubmit>
                    </Group>

                    {isMaxConsumos && (
                        <Text c="indigo.6" size="xs" ta="right">
                            Máximo {MAX_CONSUMOS} consumos permitidos por
                            reserva.
                        </Text>
                    )}
                </Stack>
            </form>
        </Modal>
    );
}

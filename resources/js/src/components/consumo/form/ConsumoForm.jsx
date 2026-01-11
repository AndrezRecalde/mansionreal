import { Select, NumberInput, SimpleGrid, Stack } from "@mantine/core";
import classes from "../../../components/elements/modules/LabelsInput.module.css";

export function ConsumoForm({
    consumo,
    idx,
    categorias,
    inventarios,
    form,
    onCategoriaChange,
}) {
    const categoriasData = categorias.map((cat) => ({
        label: cat. nombre_categoria,
        value:  String(cat.id),
    }));

    const inventariosData = inventarios.map((inv) => ({
        label: inv.nombre_producto,
        value: String(inv.id),
    }));

    return (
        <Stack spacing="sm">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing="md">
                <Select
                    required
                    searchable
                    label="Categoría"
                    placeholder="Seleccione..."
                    data={categoriasData}
                    value={consumo.categoria_id}
                    onChange={(value) => onCategoriaChange(idx, value)}
                    error={form. errors.consumos?.[idx]?.categoria_id}
                    classNames={classes}
                />
                <Select
                    required
                    searchable
                    label="Producto"
                    placeholder="Seleccione..."
                    data={inventariosData}
                    value={consumo.inventario_id}
                    onChange={(value) =>
                        form.setFieldValue(
                            `consumos.${idx}.inventario_id`,
                            value || ""
                        )
                    }
                    error={form.errors.consumos?.[idx]?.inventario_id}
                    disabled={!consumo.categoria_id}
                    classNames={classes}
                />
            </SimpleGrid>
            <NumberInput
                label="Cantidad"
                min={1}
                value={consumo.cantidad}
                onChange={(value) =>
                    form.setFieldValue(
                        `consumos.${idx}.cantidad`,
                        Number(value) || 1
                    )
                }
                required
                error={form.errors. consumos?.[idx]?.cantidad}
                classNames={classes}
            />
        </Stack>
    );
}

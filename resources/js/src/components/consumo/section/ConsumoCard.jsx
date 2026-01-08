import {
    Card,
    Group,
    Badge,
    Divider,
    Tooltip,
    ActionIcon,
    rem,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { ConsumoForm } from "../form/ConsumoForm";

export function ConsumoCard({
    consumo,
    idx,
    categorias,
    inventarios,
    form,
    onRemove,
    onCategoriaChange,
    canRemove,
}) {
    return (
        <Card
            shadow="sm"
            withBorder
            mb="xs"
            style={{
                borderLeft: `4px solid #0047AB`,
                position: "relative",
            }}
        >
            <Group align="center" justify="space-between">
                <Badge color="teal" radius="sm" variant="dot">
                    Consumo {idx + 1}
                </Badge>
                {canRemove && (
                    <Tooltip label="Eliminar consumo" withArrow>
                        <ActionIcon
                            size="md"
                            color="red.8"
                            variant="filled"
                            onClick={() => onRemove(idx)}
                            aria-label={`Eliminar consumo ${idx + 1}`}
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Tooltip>
                )}
            </Group>
            <Divider my={rem(8)} />

            <ConsumoForm
                consumo={consumo}
                idx={idx}
                categorias={categorias}
                inventarios={inventarios}
                form={form}
                onCategoriaChange={onCategoriaChange}
            />
        </Card>
    );
}

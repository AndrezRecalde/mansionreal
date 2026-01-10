import { Group, Stack } from "@mantine/core";
import { TitlePage } from "../../../components";
import { IconBeach, IconBuilding } from "@tabler/icons-react";
import { BtnAddActions } from "../../../components";
import { useMediaQuery } from "@mantine/hooks";

export const CalendarioHeader = ({ onReservar, onEstadia }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const menuActions = [
        {
            label: "Hospedaje",
            icon: IconBuilding,
            onClick: onReservar,
            color: "indigo",
        },
        {
            label: "Estadia",
            icon: IconBeach,
            onClick: onEstadia,
            color: "green",
        },
    ];

    return (
        <Stack gap="sm">
            {isMobile ? (
                <>
                    <Group justify="center">
                        <TitlePage order={3}>
                            Calendario de Disponibilidad
                        </TitlePage>
                    </Group>
                    <Group justify="center">
                        <BtnAddActions actions={menuActions} fullWidth>
                            Crear nuevo
                        </BtnAddActions>
                    </Group>
                </>
            ) : (
                <Group justify="space-between">
                    <Group>
                        <TitlePage order={2}>
                            Calendario de Disponibilidad
                        </TitlePage>
                    </Group>
                    <Group>
                        <BtnAddActions actions={menuActions}>
                            Crear nuevo
                        </BtnAddActions>
                    </Group>
                </Group>
            )}
        </Stack>
    );
};

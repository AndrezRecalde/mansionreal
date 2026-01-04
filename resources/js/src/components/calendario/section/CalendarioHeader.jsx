import { Group } from "@mantine/core";
import { TitlePage } from "../../../components";
import { IconBeach, IconBuilding } from "@tabler/icons-react";
import { BtnAddActions } from "../../../components";

export const CalendarioHeader = ({ onReservar, onEstadia }) => {
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
        <Group justify="space-between">
            <Group>
                <TitlePage order={2}>Calendario de Disponibilidad</TitlePage>
            </Group>
            <Group>
                <BtnAddActions actions={menuActions}>Crear nuevo</BtnAddActions>
            </Group>
        </Group>
    );
};

import { Group, Stack } from "@mantine/core";
import { PrincipalSectionPage, TitlePage } from "../../../components";
import { IconBeach, IconBuilding, IconCalendar } from "@tabler/icons-react";
import { BtnAddActions } from "../../../components";
import { useMediaQuery } from "@mantine/hooks";
import { PAGE_TITLE } from "../../../helpers/getPrefix";

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
                        <PrincipalSectionPage
                            title={PAGE_TITLE.CALENDARIO_RESERVAS.TITLE_PAGE}
                            description={
                                PAGE_TITLE.CALENDARIO_RESERVAS.DESCRIPCION_PAGE
                            }
                            icon={<IconCalendar size={22} />}
                        />
                    </Group>
                    <Group justify="center">
                        <BtnAddActions actions={menuActions} fullWidth>
                            {PAGE_TITLE.CALENDARIO_RESERVAS.BUTTONS.CREAR_NUEVO}
                        </BtnAddActions>
                    </Group>
                </>
            ) : (
                <Group justify="space-between">
                    <Group>
                        <PrincipalSectionPage
                            title={PAGE_TITLE.CALENDARIO_RESERVAS.TITLE_PAGE}
                            description={
                                PAGE_TITLE.CALENDARIO_RESERVAS.DESCRIPCION_PAGE
                            }
                            icon={<IconCalendar size={22} />}
                        />
                    </Group>
                    <Group>
                        <BtnAddActions actions={menuActions}>
                            {PAGE_TITLE.CALENDARIO_RESERVAS.BUTTONS.CREAR_NUEVO}
                        </BtnAddActions>
                    </Group>
                </Group>
            )}
        </Stack>
    );
};

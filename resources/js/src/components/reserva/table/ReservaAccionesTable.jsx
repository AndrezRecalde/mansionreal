import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { TextSection } from "../../../components";
import { IconChecks, IconFileText } from "@tabler/icons-react";
import { useReservaDepartamentoStore, useUiConsumo, useUiReservaDepartamento } from "../../../hooks";

export const ReservaAccionesTable = ({
    datos,
    //handleFinalizarReserva,
    //handleExportarNota,
}) => {
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();
    const { fnAbrirModalReservaFinalizar } =
        useUiReservaDepartamento();
    const { fnExportarNotaVentaPDF } = useReservaDepartamentoStore();

    const handleFinalizarReservaClick = () => {
        //handleFinalizarReserva(datos.reserva_id);
        fnAbrirDrawerConsumosDepartamento(false);
        fnAbrirModalReservaFinalizar(true);
    };

    const handleExportarNotaVentaPDF = (dato) => {
        fnExportarNotaVentaPDF({ reserva_id: dato })
    }

    return (
        <Group justify="space-between" align="center">
            <Group gap={25}>
                <TextSection
                    color="indigo.7"
                    fs="italic"
                    tt=""
                    fz={18}
                    fw={800}
                >
                    Departamento No. {datos.numero_departamento}
                </TextSection>
            </Group>
            <Group gap={25}>
                <Tooltip label="Finalizar Reserva">
                    <ActionIcon
                        variant="default"
                        size="xl"
                        radius="xs"
                        aria-label="Finalizar Reserva"
                        onClick={handleFinalizarReservaClick}
                    >
                        <IconChecks
                            style={{ width: "80%", height: "80%" }}
                            stroke={1.5}
                        />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Exportar Nota de Venta">
                    <ActionIcon
                        variant="default"
                        size="xl"
                        radius="xs"
                        aria-label="Exportar Nota de Venta"
                        onClick={() => handleExportarNotaVentaPDF(datos.reserva_id)}
                    >
                        <IconFileText
                            style={{ width: "80%", height: "80%" }}
                            stroke={1.5}
                        />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Group>
    );
};

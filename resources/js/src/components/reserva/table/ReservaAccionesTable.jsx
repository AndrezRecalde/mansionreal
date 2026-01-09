import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { TextSection } from "../../../components";
import { IconChecks, IconFileText } from "@tabler/icons-react";
import {
    useReservaDepartamentoStore,
    useUiConsumo,
    useUiReservaDepartamento,
} from "../../../hooks";
import { Estados } from "../../../helpers/getPrefix";

export const ReservaAccionesTable = ({
    datos,
    //handleFinalizarReserva,
    //handleExportarNota,
}) => {
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();
    const { fnAbrirModalReservaFinalizar } = useUiReservaDepartamento();
    const { fnExportarNotaVentaPDF } = useReservaDepartamentoStore();

    const handleFinalizarReservaClick = () => {
        //handleFinalizarReserva(datos.reserva_id);
        fnAbrirDrawerConsumosDepartamento(false);
        fnAbrirModalReservaFinalizar(true);
    };

    const handleExportarNotaVentaPDF = (dato) => {
        fnExportarNotaVentaPDF({ reserva_id: dato });
        //console.log(dato);
    };

    return (
        <Group justify="space-between" align="center">
            <Group gap={25}>
                <TextSection
                    color={datos.estado?.color || "indigo.7"}
                    fs="italic"
                    tt=""
                    fz={16}
                    fw={800}
                >
                    {datos.numero_departamento
                        ? `Departamento No. ${datos.numero_departamento} — ${datos.estado?.nombre_estado}`
                        : `Resumen de Estadia  — ${datos.estado?.nombre_estado}`}
                </TextSection>
            </Group>
            <Group gap={25}>
                <Tooltip label="Finalizar Reserva">
                    <ActionIcon
                        variant="default"
                        size="xl"
                        radius="xs"
                        onClick={handleFinalizarReservaClick}
                        disabled={
                            datos.estado?.nombre_estado === Estados.CANCELADO ||
                            datos.estado?.nombre_estado === Estados.PAGADO
                        }
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
                        onClick={() =>
                            handleExportarNotaVentaPDF(datos.reserva_id)
                        }
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

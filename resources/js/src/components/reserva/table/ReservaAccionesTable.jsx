import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { TextSection } from "../../../components";
import { IconChecks, IconFileText, IconProgressX } from "@tabler/icons-react";
import {
    useReservaDepartamentoStore,
    useUiConsumo,
    useUiReservaDepartamento,
    useFacturaStore, // ← NUEVO: Importar hook de factura
} from "../../../hooks";
import { Estados } from "../../../helpers/getPrefix";
import Swal from "sweetalert2";

export const ReservaAccionesTable = ({ datos }) => {
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();
    const { fnAbrirModalReservaFinalizar, fnAbrirModalCancelarReserva } =
        useUiReservaDepartamento();

    // ❌ ELIMINAR: const { fnExportarNotaVentaPDF } = useReservaDepartamentoStore();

    // ✅ NUEVO:  Usar hook de factura
    const { fnCargarFacturaPorReserva, fnDescargarFacturaPDF } =
        useFacturaStore();

    const handleFinalizarReservaClick = () => {
        fnAbrirModalReservaFinalizar(true);
    };

    const handleCancelarReservaClick = () => {
        fnAbrirModalCancelarReserva(true);
    };

    // ✅ NUEVO:  Función para descargar factura
    const handleDescargarFactura = async () => {
        console.log(datos);
        try {
            // Primero obtener la factura de la reserva
            const factura = await fnCargarFacturaPorReserva(datos.reserva_id);

            if (factura && factura.id) {
                // Descargar el PDF de la factura
                await fnDescargarFacturaPDF(factura.id);
            } else {
                // Si no hay factura, mostrar mensaje
                Swal.fire({
                    icon: "warning",
                    title: "Sin factura",
                    text: "Esta reserva aún no tiene una factura generada.",
                    showConfirmButton: true,
                    confirmButtonText: "Aceptar",
                });
                // Opcional: Mostrar notificación al usuario
                // notifications.show({
                //     title: 'Sin factura',
                //     message: 'Esta reserva aún no tiene una factura generada',
                //     color: 'yellow'
                // });
            }
        } catch (error) {
            //console.error("Error al descargar factura:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al descargar la factura.",
                showConfirmButton: true,
                confirmButtonText: "Aceptar",
            });
        }
    };

    return (
        <Group justify="space-between" align="center">
            <Group gap={25}>
                <TextSection
                    color={datos.estado?.color || "indigo. 7"}
                    fs="italic"
                    tt=""
                    fz={16}
                    fw={800}
                >
                    {datos.numero_departamento
                        ? `${datos.tipo_departamento + " " + datos.numero_departamento} — ${datos.estado?.nombre_estado}`
                        : `Resumen de Estadia  — ${datos.estado?.nombre_estado}`}
                </TextSection>
            </Group>
            <Group gap={20}>
                {/* Botón Finalizar Reserva */}
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

                {/* ✅ BOTÓN ACTUALIZADO: Descargar Factura */}
                <Tooltip label="Descargar Factura">
                    <ActionIcon
                        variant="default"
                        size="xl"
                        radius="xs"
                        onClick={handleDescargarFactura}
                        disabled={
                            datos.estado?.nombre_estado !== Estados.PAGADO
                        }
                    >
                        <IconFileText
                            style={{ width: "80%", height: "80%" }}
                            stroke={1.5}
                        />
                    </ActionIcon>
                </Tooltip>

                {/* Botón Cancelar Reserva */}
                <Tooltip label="Cancelar Reserva">
                    <ActionIcon
                        variant="default"
                        size="xl"
                        radius="xs"
                        onClick={handleCancelarReservaClick}
                        disabled={
                            datos.estado?.nombre_estado === Estados.CANCELADO ||
                            datos.estado?.nombre_estado === Estados.PAGADO
                        }
                    >
                        <IconProgressX
                            style={{ width: "80%", height: "80%" }}
                            stroke={1.5}
                        />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Group>
    );
};

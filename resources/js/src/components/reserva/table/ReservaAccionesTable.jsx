import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { TextSection, VisorFacturaPDF } from "../../../components";
import { IconChecks, IconFileText, IconProgressX } from "@tabler/icons-react";
import {
    //useUiConsumo,
    useUiReservaDepartamento,
    useFacturaStore,
    useUiFactura,
} from "../../../hooks";
import { Estados, Roles } from "../../../helpers/getPrefix";
import Swal from "sweetalert2";

export const ReservaAccionesTable = ({ datos, usuario }) => {
    //const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();
    const { fnAbrirModalReservaFinalizar, fnAbrirModalCancelarReserva } =
        useUiReservaDepartamento();

    const {
        pdfUrl,
        activarFactura,
        fnLimpiarPdfUrl,
        fnDescargarFacturaPDF,
        fnCargarFacturaPorReserva,
        fnPrevisualizarFacturaPDF,
        fnActivarFactura,
    } = useFacturaStore();

    const { abrirModalPdfFactura, fnAbrirModalPdfFactura } = useUiFactura();

    const handleFinalizarReservaClick = () => {
        fnAbrirModalReservaFinalizar(true);
    };

    const handleCancelarReservaClick = () => {
        fnAbrirModalCancelarReserva(true);
    };

    const handlePrevisualizarFactura = async () => {
        try {
            // 1. Obtener la factura de la reserva
            const factura = await fnCargarFacturaPorReserva(datos.reserva_id);

            if (factura && factura.id) {
                // 2. Activar la factura en el estado
                fnActivarFactura(factura);

                // 3. Previsualizar PDF
                await fnPrevisualizarFacturaPDF(factura.id);

                // 4. Abrir modal del visor
                fnAbrirModalPdfFactura(true);
            } else {
                // Si no hay factura, mostrar mensaje
                Swal.fire({
                    icon: "warning",
                    title: "Sin factura",
                    text: "Esta reserva aún no tiene una factura generada.",
                    showConfirmButton: true,
                    confirmButtonText: "Aceptar",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al cargar la factura.",
                showConfirmButton: true,
                confirmButtonText: "Aceptar",
            });
        }
    };

    const handleCerrarPdfModal = () => {
        fnAbrirModalPdfFactura(false);
        fnLimpiarPdfUrl();
    };

    const handleDescargarPdf = () => {
        if (activarFactura) {
            fnDescargarFacturaPDF(activarFactura.id);
        }
    };

    return (
        <div>
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
                            ? `${
                                  datos.tipo_departamento +
                                  " " +
                                  datos.numero_departamento
                              } — ${datos.estado?.nombre_estado}`
                            : `Resumen de Estadia  — ${datos.estado?.nombre_estado}`}
                    </TextSection>
                </Group>
                {usuario.role === Roles.GERENCIA || usuario.role === Roles.ADMINISTRADOR ? (
                    <Group gap={20}>
                        {/* Botón Finalizar Reserva */}
                        <Tooltip label="Finalizar Reserva">
                            <ActionIcon
                                variant="default"
                                size="xl"
                                radius="xs"
                                onClick={handleFinalizarReservaClick}
                                disabled={
                                    datos.estado?.nombre_estado ===
                                        Estados.CANCELADO ||
                                    datos.estado?.nombre_estado ===
                                        Estados.PAGADO
                                }
                            >
                                <IconChecks
                                    style={{ width: "80%", height: "80%" }}
                                    stroke={1.5}
                                />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Ver Factura PDF">
                            <ActionIcon
                                variant="default"
                                size="xl"
                                radius="xs"
                                onClick={handlePrevisualizarFactura}
                                disabled={
                                    datos.estado?.nombre_estado !==
                                    Estados.PAGADO
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
                                    datos.estado?.nombre_estado ===
                                        Estados.CANCELADO ||
                                    datos.estado?.nombre_estado ===
                                        Estados.PAGADO
                                }
                            >
                                <IconProgressX
                                    style={{ width: "80%", height: "80%" }}
                                    stroke={1.5}
                                />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                ) : null}
            </Group>
            <VisorFacturaPDF
                opened={abrirModalPdfFactura}
                onClose={handleCerrarPdfModal}
                pdfUrl={pdfUrl}
                facturaNumero={activarFactura?.numero_factura}
                onDownload={handleDescargarPdf}
            />
        </div>
    );
};

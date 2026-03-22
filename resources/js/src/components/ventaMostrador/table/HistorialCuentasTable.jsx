import { useMemo, useState } from "react";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { useMantineReactTable } from "mantine-react-table";
import {
    Badge,
    Modal,
    Text,
    Stack,
    Group,
    Divider,
    Button,
    Textarea,
    Alert,
} from "@mantine/core";
import {
    IconEye,
    IconFileInvoice,
    IconFileX,
    IconAlertTriangle,
} from "@tabler/icons-react";
import { ContenidoTable, MenuAcciones } from "../../../components";
import { formatearMonto } from "../../../helpers/fnHelper";
import dayjs from "dayjs";

export const HistorialCuentasTable = ({
    datos,
    cargando,
    onVerFactura,
    onAnularFactura,
}) => {
    const [cuentaDetalle, setCuentaDetalle] = useState(null);
    const [cuentaAnular, setCuentaAnular] = useState(null);
    const [motivoAnulacion, setMotivoAnulacion] = useState("");
    const [anulando, setAnulando] = useState(false);

    const handleConfirmarAnulacion = async () => {
        if (!cuentaAnular || motivoAnulacion.trim().length < 10) return;
        setAnulando(true);
        await onAnularFactura(cuentaAnular, motivoAnulacion.trim());
        setAnulando(false);
        setCuentaAnular(null);
        setMotivoAnulacion("");
    };

    const columns = useMemo(
        () => [
            {
                header: "Código",
                accessorKey: "codigo",
                size: 100,
            },
            {
                header: "Fecha Cierre",
                accessorKey: "updated_at",
                Cell: ({ cell }) =>
                    dayjs(cell.getValue()).format("DD/MM/YYYY HH:mm"),
            },
            {
                header: "Cajero",
                accessorFn: (row) =>
                    `${row.usuario?.nombres || ""} ${row.usuario?.apellidos || ""}`,
                id: "cajero",
            },
            {
                header: "Total",
                accessorKey: "total",
                Cell: ({ cell }) => (
                    <Text fw={600}>{formatearMonto(cell.getValue())}</Text>
                ),
            },
            {
                header: "Factura",
                accessorFn: (row) =>
                    row.factura?.numero_factura || "Sin Factura",
                id: "factura",
                Cell: ({ cell, row }) => {
                    const factura = row.original.factura;
                    if (!factura) {
                        return (
                            <Text c="dimmed" size="xs">
                                Ninguna
                            </Text>
                        );
                    }
                    const color =
                        factura.estado === "EMITIDA" ? "blue" : "red";
                    return (
                        <Badge color={color} variant="light">
                            {cell.getValue()}
                        </Badge>
                    );
                },
            },
            {
                header: "Estado Factura",
                accessorFn: (row) => row.factura?.estado ?? "—",
                id: "estado_factura",
                Cell: ({ cell }) => {
                    const val = cell.getValue();
                    if (val === "—")
                        return (
                            <Text c="dimmed" size="xs">
                                —
                            </Text>
                        );
                    return (
                        <Badge
                            color={val === "EMITIDA" ? "teal" : "red"}
                            variant="dot"
                        >
                            {val}
                        </Badge>
                    );
                },
            },
            {
                header: "Estado Cuenta",
                accessorKey: "estado.nombre_estado",
                Cell: ({ cell }) => (
                    <Badge
                        color={
                            cell.getValue() === "PAGADO" ? "green" : "yellow"
                        }
                    >
                        {cell.getValue()}
                    </Badge>
                ),
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data: datos,
        state: { showProgressBars: cargando },
        enableFacetedValues: true,
        enableRowActions: true,
        localization: MRT_Localization_ES,
        enableStickyHeader: true,
        enableColumnPinning: true,
        initialState: {
            density: "md",
            columnPinning: { right: ["mrt-row-actions"] },
        },
        mantineTableProps: {
            striped: true,
            highlightOnHover: true,
            withColumnBorders: true,
            withTableBorder: true,
        },
        renderRowActions: ({ row }) => {
            const factura = row.original.factura;
            const facturaEmitida = factura?.estado === "EMITIDA";
            const facturaAnulada = factura?.estado === "ANULADA";

            return (
                <MenuAcciones
                    row={row}
                    items={[
                        {
                            label: "Ver Detalle",
                            icon: IconEye,
                            onClick: (selected) => setCuentaDetalle(selected),
                        },
                        {
                            label: "Visualizar Factura",
                            icon: IconFileInvoice,
                            onClick: (selected) =>
                                onVerFactura(selected.factura),
                            disabled: !factura,
                        },
                        {
                            label: "Anular Factura",
                            icon: IconFileX,
                            color: "red",
                            onClick: (selected) => {
                                setCuentaAnular(selected);
                                setMotivoAnulacion("");
                            },
                            disabled: !facturaEmitida,
                            description: facturaAnulada
                                ? "La factura ya fue anulada"
                                : !factura
                                  ? "La cuenta no tiene factura"
                                  : undefined,
                        },
                    ]}
                />
            );
        },
    });

    return (
        <>
            <ContenidoTable table={table} />

            {/* Modal Detalle Cuenta */}
            <Modal
                opened={!!cuentaDetalle}
                onClose={() => setCuentaDetalle(null)}
                title={
                    <Text fw={600}>
                        Detalle de Cuenta: {cuentaDetalle?.codigo}
                    </Text>
                }
                size="xl"
            >
                {cuentaDetalle && (
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Atendido por:
                            </Text>
                            <Text size="sm" fw={600}>
                                {cuentaDetalle.usuario?.nombres}{" "}
                                {cuentaDetalle.usuario?.apellidos}
                            </Text>
                        </Group>

                        <Divider />
                        <Text fw={600} size="sm">
                            Consumos Registrados
                        </Text>
                        <Stack gap="xs">
                            {cuentaDetalle.consumos?.map((c) => (
                                <Group justify="space-between" key={c.id}>
                                    <Text size="sm">
                                        {c.cantidad}x{" "}
                                        {c.inventario?.nombre_producto}
                                    </Text>
                                    <Text size="sm" fw={500}>
                                        {formatearMonto(c.total)}
                                    </Text>
                                </Group>
                            ))}
                        </Stack>

                        <Divider />
                        <Text fw={600} size="sm">
                            Pagos ({cuentaDetalle.pagos?.length})
                        </Text>
                        <Stack gap="xs">
                            {cuentaDetalle.pagos?.map((p) => (
                                <Group justify="space-between" key={p.id}>
                                    <Text size="sm">
                                        {p.metodo_pago +
                                            (p.codigo_voucher
                                                ? " - " + p.codigo_voucher
                                                : "")}
                                    </Text>
                                    <Text size="sm" fw={500} c="green">
                                        {formatearMonto(p.monto)}
                                    </Text>
                                </Group>
                            ))}
                        </Stack>

                        <Divider mb="xs" />
                        <Group justify="space-between">
                            <Text size="lg" fw={700}>
                                Total Cuenta:
                            </Text>
                            <Text size="lg" fw={700} c="blue">
                                {formatearMonto(cuentaDetalle.total)}
                            </Text>
                        </Group>
                    </Stack>
                )}
            </Modal>

            {/* Modal Anular Factura */}
            <Modal
                opened={!!cuentaAnular}
                onClose={() => {
                    if (!anulando) {
                        setCuentaAnular(null);
                        setMotivoAnulacion("");
                    }
                }}
                title={
                    <Text fw={600} c="red">
                        Anular Factura — {cuentaAnular?.codigo}
                    </Text>
                }
                size="md"
            >
                <Stack gap="md">
                    <Alert
                        icon={<IconAlertTriangle size={16} />}
                        color="red"
                        variant="light"
                    >
                        Esta acción anulará la factura{" "}
                        <strong>
                            {cuentaAnular?.factura?.numero_factura}
                        </strong>{" "}
                        y devolverá la cuenta al estado{" "}
                        <strong>PENDIENTE</strong>. Esta acción no se puede
                        deshacer.
                    </Alert>

                    <Textarea
                        label="Motivo de anulación"
                        description="Mínimo 10 caracteres"
                        placeholder="Ingrese el motivo de la anulación..."
                        minRows={3}
                        value={motivoAnulacion}
                        onChange={(e) => setMotivoAnulacion(e.target.value)}
                        error={
                            motivoAnulacion.length > 0 &&
                            motivoAnulacion.trim().length < 10
                                ? "El motivo debe tener al menos 10 caracteres"
                                : null
                        }
                        required
                    />

                    <Group justify="flex-end" mt="sm">
                        <Button
                            variant="default"
                            onClick={() => {
                                setCuentaAnular(null);
                                setMotivoAnulacion("");
                            }}
                            disabled={anulando}
                        >
                            Cancelar
                        </Button>
                        <Button
                            color="red"
                            leftSection={<IconFileX size={16} />}
                            loading={anulando}
                            disabled={motivoAnulacion.trim().length < 10}
                            onClick={handleConfirmarAnulacion}
                        >
                            Confirmar Anulación
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
};

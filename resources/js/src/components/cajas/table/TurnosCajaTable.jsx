import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Badge } from "@mantine/core";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import dayjs from "dayjs";

const formatMoney = (v) =>
    parseFloat(v || 0).toLocaleString("es-EC", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    });

export const TurnosCajaTable = ({ data, isLoading }) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: "caja.nombre",
                header: "Caja/Estación",
            },
            {
                accessorKey: "usuario.nombres",
                header: "Cajero",
                Cell: ({ row }) => {
                    const usuario = row.original.usuario;
                    return `${usuario?.nombres} ${usuario?.apellidos}`;
                },
            },
            {
                accessorKey: "fecha_apertura",
                header: "Apertura",
                Cell: ({ cell }) =>
                    dayjs(cell.getValue()).format("DD MMM YYYY HH:mm"),
            },
            {
                accessorKey: "fecha_cierre",
                header: "Cierre",
                Cell: ({ cell }) =>
                    cell.getValue()
                        ? dayjs(cell.getValue()).format("DD MMM YYYY HH:mm")
                        : "N/A",
            },
            {
                accessorKey: "monto_apertura_efectivo",
                header: "Base ($)",
                Cell: ({ cell }) => formatMoney(cell.getValue()),
            },
            {
                accessorKey: "monto_ventas_sistema",
                header: "Esperado ($)",
                Cell: ({ cell }) => formatMoney(cell.getValue()),
            },
            {
                accessorKey: "monto_cierre_efectivo_declarado",
                header: "Declarado ($)",
                Cell: ({ cell }) => formatMoney(cell.getValue()),
            },
            {
                accessorKey: "diferencia",
                header: "Cuadre",
                Cell: ({ cell }) => {
                    const dif = parseFloat(cell.getValue());
                    let color = "gray";
                    if (dif > 0) color = "blue";
                    if (dif < 0) color = "red";
                    if (dif === 0) color = "green";

                    return (
                        <Badge color={color} variant="light">
                            {dif > 0 ? "+" : ""}
                            {formatMoney(dif)}
                        </Badge>
                    );
                },
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data: data || [],
        state: {
            isLoading,
        },
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        localization: MRT_Localization_ES,
        initialState: {
            density: "xs",
            pagination: { pageSize: 20 },
            sorting: [{ id: "fecha_cierre", desc: true }],
        },
    });

    return <MantineReactTable table={table} />;
};

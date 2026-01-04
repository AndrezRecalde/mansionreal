import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { useMantineTheme } from "@mantine/core";
import {
    useDisponibilidadColumns,
    DepartamentoMenu,
    DetalleReservaTable,
    ContenidoTable,
} from "../../../components";
import {
    useDepartamentoStore,
    useReservaDepartamentoStore,
    useUiReservaDepartamento,
} from "../../../hooks";
import { getEstadoColor } from "../../../helpers/fnHelper";

export const DisponibilidadTable = ({ setOpened }) => {
    const {
        departamentos,
        cargando,
        fnAsignarDepartamento,
        fnCambiarEstadoDepartamento,
    } = useDepartamentoStore();
    const { fnAbrirModalReservarDepartamento, fnAbrirModalReservaFinalizar } =
        useUiReservaDepartamento();
    const { fnAsignarReserva } = useReservaDepartamentoStore();
    const theme = useMantineTheme();

    const handleReservarClick = (selected) => {
        fnAsignarDepartamento(selected);
        fnAbrirModalReservarDepartamento(true);
    };

    const handleEstadoClick = ({ id, nombre_estado }) => {
        fnCambiarEstadoDepartamento({ id, nombre_estado });
    };

    const handleFinalizarReservaClick = (selected) => {
        fnAsignarReserva(selected);
        fnAbrirModalReservaFinalizar(true);
    };

    const columns = useDisponibilidadColumns({
        theme,
        setOpened,
        fnAsignarDepartamento,
        handleReservarClick,
        handleEstadoClick,
        handleFinalizarReservaClick,
    });

    const table = useMantineReactTable({
        columns,
        data: departamentos,
        state: { showProgressBars: cargando },
        enableFacetedValues: true,
        enableRowActions: true,
        localization: MRT_Localization_ES,
        renderRowActionMenuItems: ({ row }) => {
            const departamento = row.original;
            const disabled =
                departamento.estado.nombre === "OCUPADO" ||
                departamento.estado.nombre === "RESERVADO";
            return (
                <DepartamentoMenu
                    departamento={departamento}
                    theme={theme}
                    onReservar={handleReservarClick}
                    onEstado={handleEstadoClick}
                    disabled={disabled}
                />
            );
        },
        mantineTableBodyCellProps: ({ cell }) => ({
            style: {
                backgroundColor: [
                    "OCUPADO",
                    "RESERVADO",
                    "LIMPIEZA",
                    "MANTENIMIENTO",
                ].includes(cell.row.original.estado.nombre)
                    ? getEstadoColor(theme, cell.row.original.estado.color)
                    : "inherit",
                color: [
                    "OCUPADO",
                    "RESERVADO",
                    "LIMPIEZA",
                    "MANTENIMIENTO",
                ].includes(cell.row.original.estado.nombre)
                    ? theme.white
                    : "inherit",
            },
        }),
        renderDetailPanel: ({ row }) => <DetalleReservaTable row={row} />,
        mantineTableProps: {
            withColumnBorders: true,
            withTableBorder: true,
            sx: {
                "thead > tr": { backgroundColor: "inherit" },
                "thead > tr > th": { backgroundColor: "inherit" },
                "tbody > tr > td": { backgroundColor: "inherit" },
            },
        },
    });

    return <ContenidoTable table={table} />;
};

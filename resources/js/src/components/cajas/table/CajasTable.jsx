import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { Badge } from "@mantine/core";
import { MenuAcciones } from "../../elements/table/MenuAcciones";
import { useCajasStore } from "../../../hooks";
import Swal from "sweetalert2";
import { IconEdit, IconToggleLeft, IconTrash } from "@tabler/icons-react";

export const CajasTable = () => {
    const {
        cajasData,
        cargando,
        fnActivarCaja,
        fnEliminarCaja,
        setActivaCaja,
        setModalCajaCRUD,
    } = useCajasStore();

    const onEdit = (caja) => {
        setActivaCaja(caja);
        setModalCajaCRUD(true);
    };

    const onToggle = (caja) => {
        Swal.fire({
            title: `¿${caja.activa ? "Desactivar" : "Activar"} Caja?`,
            text: `¿Seguro que deseas ${caja.activa ? "desactivar" : "activar"} la caja ${caja.nombre}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, proceder",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fnActivarCaja(caja.id);
                if (res) {
                    Swal.fire({
                        title: "Éxito",
                        text: `Caja ${caja.activa ? "desactivada" : "activada"} correctamente`,
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                }
            }
        });
    };

    const onDelete = (caja) => {
        Swal.fire({
            title: `¿Eliminar Caja?`,
            text: `Esta acción es destructiva. ¿Seguro que deseas eliminar la caja ${caja.nombre}?`,
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fnEliminarCaja(caja.id);
                if (res) {
                    Swal.fire({
                        title: "Éxito",
                        text: `Caja eliminada correctamente`,
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                }
            }
        });
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "nombre",
                header: "Nombre de Caja",
            },
            {
                accessorKey: "descripcion",
                header: "Descripción",
            },
            {
                accessorKey: "turnos_count",
                header: "Turnos Abiertos (Vigentes)",
                Cell: ({ cell }) => (
                    <Badge color={cell.getValue() > 0 ? "blue" : "gray"}>
                        {cell.getValue()} Turno(s)
                    </Badge>
                ),
            },
            {
                accessorKey: "activa",
                header: "Estado",
                Cell: ({ cell }) => (
                    <Badge color={cell.getValue() ? "green" : "red"}>
                        {cell.getValue() ? "Activa" : "Desactivada"}
                    </Badge>
                ),
            },
            {
                id: "acciones",
                header: "Acciones",
                Cell: ({ row }) => (
                    <MenuAcciones
                        row={row}
                        items={[
                            {
                                label: "Editar",
                                icon: IconEdit,
                                onClick: onEdit,
                                disabled: false,
                                color: "",
                            },
                            {
                                label: "Eliminar",
                                icon: IconTrash,
                                onClick: onDelete,
                                disabled: false,
                                color: "",
                            },
                            {
                                label: "Activar",
                                icon: IconToggleLeft,
                                onClick: onToggle,
                                disabled: false,
                                color: "",
                            },
                        ]}
                    />
                ),
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data: cajasData || [],
        state: { isLoading: cargando },
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        localization: MRT_Localization_ES,
        initialState: { density: "xs" },
        mantineTableProps: {
            striped: true,
            highlightOnHover: true,
            withColumnBorders: true,
            withTableBorder: true,
        },
    });

    return <MantineReactTable table={table} />;
};

import { useEffect, useMemo, useState } from "react";
import {
    Container,
    Divider,
    Fieldset,
    Group,
    Select,
    Badge,
} from "@mantine/core";
import { TextSection, TitlePage } from "../../components";
import { useInventarioStore, useTitleHook } from "../../hooks";
import { MantineReactTable } from "mantine-react-table";

const HistorialMovimientosInvPage = () => {
    useTitleHook("Historial de Movimientos - Inventario");

    const {
        fnCargarProductosInventario,
        inventarios,
        fnCargarHistorialMovimientos,
        movimientos,
        paginacion,
        cargando,
        fnLimpiarInventarios,
    } = useInventarioStore();

    const [productoId, setProductoId] = useState(null);

    // PAGINACION
    const [pagination, setPagination] = useState({
        pageIndex: 0, // MRT usa 0-indexed
        pageSize: 20,
    });

    useEffect(() => {
        fnCargarProductosInventario({ activo: 1, all: true });

        return () => {
            fnLimpiarInventarios();
        };
    }, []);

    useEffect(() => {
        if (productoId) {
            fnCargarHistorialMovimientos(productoId, {
                page: pagination.pageIndex + 1, // tu backend espera 1-indexed
                per_page: pagination.pageSize,
            });
        }
        // Solo se llama cuando cambia producto o paginación
    }, [productoId, pagination]);

    // Extraer datos del JSON
    const movimientosArray = movimientos?.movimientos || [];

    const columns = useMemo(
        () => [
            // ... igual que antes ...
            {
                accessorKey: "fecha_movimiento",
                header: "Fecha",
                Cell: ({ cell }) =>
                    new Date(cell.getValue()).toLocaleString("es-EC"),
            },
            {
                accessorKey: "tipo_movimiento",
                header: "Tipo",
            },
            {
                accessorKey: "usuario",
                header: "Usuario",
                Cell: ({ row }) => {
                    const usuario = row.original.usuario;
                    return usuario
                        ? `${usuario.nombres} ${usuario.apellidos}`
                        : "—";
                },
            },
            {
                accessorKey: "reserva",
                header: "Reserva",
                Cell: ({ row }) => {
                    const reserva = row.original.reserva;
                    return reserva ? reserva.codigo_reserva : "—";
                },
            },
            {
                accessorKey: "consumo",
                header: "Consumo",
                Cell: ({ row }) => {
                    const consumo = row.original.consumo;
                    return consumo ? consumo.cantidad : "—";
                },
            },
            {
                accessorKey: "cantidad",
                header: "Cantidad",
            },
            {
                accessorKey: "motivo",
                header: "Motivo",
            },
            {
                accessorKey: "observacion",
                header: "Observación",
            },
        ],
        []
    );

    return (
        <Container size="xl" my={20}>
            <Group justify="space-between" mb={10}>
                <TitlePage order={2}>
                    Historial Movimientos — Productos
                </TitlePage>
            </Group>
            <Divider my={10} />
            <Fieldset legend="Filtrar Búsqueda">
                <Select
                    label="Seleccione un producto"
                    placeholder="Seleccione un producto"
                    data={inventarios.map((inv) => ({
                        value: inv.id.toString(),
                        label: inv.nombre_producto,
                    }))}
                    searchable
                    nothingFoundMessage="No hay resultados"
                    onChange={(value) => {
                        setProductoId(value);
                        setPagination({ ...pagination, pageIndex: 0 }); // Reinicia paginación al cambiar producto
                    }}
                />
            </Fieldset>
            <Divider my={20} />

            <MantineReactTable
                columns={columns}
                data={movimientosArray}
                state={{
                    isLoading: cargando,
                    pagination,
                }}
                // PAGINACION REMOTA
                manualPagination
                rowCount={paginacion.total || 0}
                onPaginationChange={setPagination}
                mantineTableProps={{
                    striped: true,
                    highlightOnHover: true,
                    withTableBorder: true,
                    withColumnBorders: true,
                }}
                renderTopToolbarCustomActions={() => (
                    <Group>
                        {movimientos?.movimientos?.length > 0 && (
                            <Group>
                                <TextSection
                                    tt=""
                                    td="underline"
                                    fz={12}
                                    fw={700}
                                    fs="italic"
                                >
                                    {movimientos?.inventario?.nombre_producto}
                                </TextSection>
                                <Badge color="blue" variant="light">
                                    Total de movimientos:{" "}
                                    {paginacion.total || 0}
                                </Badge>
                                <Badge color="green" variant="light">
                                    Stock Actual:{" "}
                                    {movimientos?.inventario?.stock_actual || 0}
                                </Badge>
                            </Group>
                        )}
                    </Group>
                )}
            />
        </Container>
    );
};

export default HistorialMovimientosInvPage;

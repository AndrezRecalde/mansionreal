import { useEffect, useMemo, useState } from "react";
import {
    Container,
    Divider,
    Fieldset,
    Group,
    Select,
    Badge,
    SimpleGrid,
    Button,
} from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { BtnSection, TextSection, TitlePage } from "../../components";
import { useInventarioStore, useTitleHook } from "../../hooks";
import { MantineReactTable } from "mantine-react-table";
import { formatFechaHoraModal } from "../../helpers/fnHelper";
import classes from "../../components/elements/modules/LabelsInput.module.css";

const HistorialMovimientosInvPage = () => {
    useTitleHook("Historial de Movimientos - Inventario");

    const {
        fnCargarProductosInventario,
        inventarios,
        fnCargarHistorialMovimientos,
        movimientos,
        cargando,
        fnLimpiarInventarios,
    } = useInventarioStore();

    const [productoId, setProductoId] = useState(null);
    const [anio, setAnio] = useState(null);

    const handleBuscar = () => {
        if (productoId) {
            const anioVal = anio ? new Date(anio).getFullYear() : null;
            fnCargarHistorialMovimientos(productoId, { anio: anioVal });
        }
    };

    useEffect(() => {
        fnCargarProductosInventario({ activo: 1, all: true });

        return () => {
            fnLimpiarInventarios();
        };
    }, []);

    /* useEffect(() => {
        if (productoId) {
            const anioVal = anio ? new Date(anio).getFullYear() : null;
            fnCargarHistorialMovimientos(productoId, { anio: anioVal });
        }
    }, [productoId, anio]); */

    // Extraer datos del JSON
    const movimientosArray = movimientos?.movimientos ?? [];

    const columns = useMemo(
        () => [
            // ... igual que antes ...
            {
                accessorKey: "fecha_movimiento",
                header: "Fecha",
                Cell: ({ cell }) => formatFechaHoraModal(cell.getValue()),
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
        [],
    );

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Historial Movimientos — Productos</TitlePage>
            <Divider my={10} />
            <Fieldset legend="Filtrar Búsqueda">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 2 }}>
                    <YearPickerInput
                        label="Año"
                        placeholder="Seleccione un año"
                        value={anio}
                        onChange={setAnio}
                        clearable
                        classNames={classes}
                    />
                    <Select
                        label="Producto"
                        placeholder="Seleccione un producto"
                        data={inventarios.map((inv) => ({
                            value: inv.id.toString(),
                            label: inv.nombre_producto,
                        }))}
                        searchable
                        clearable
                        nothingFoundMessage="No hay resultados"
                        onChange={(value) => setProductoId(value)}
                        classNames={classes}
                    />
                </SimpleGrid>
                <BtnSection
                    fullWidth={true}
                    mt={24}
                    onClick={handleBuscar}
                    loading={cargando}
                    disabled={!productoId}
                >
                    Buscar
                </BtnSection>
            </Fieldset>
            <Divider my={20} />

            <MantineReactTable
                columns={columns}
                data={movimientosArray}
                state={{
                    isLoading: cargando,
                }}
                autoResetPageIndex={false}
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
                                    {movimientosArray.length}
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

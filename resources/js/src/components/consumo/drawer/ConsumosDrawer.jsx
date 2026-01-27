import { useEffect } from "react";
import { Card, Drawer, Stack, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
    ConsumosDrawerTable,
    ConsumoModal,
    ConsumoEditarModal,
    ConsumoEliminarModal,
    ConsumoAplicarDescuentoModal,
    GastoDrawerTable,
    PagosTable,
    ReservaAccionesTable,
    ReservaInfoHuespedTable,
    TextSection,
} from "../../../components";
import {
    useConsumoStore,
    useGastoStore,
    usePagoStore,
    useUiConsumo,
} from "../../../hooks";
import { Roles } from "../../../helpers/getPrefix";

export const ConsumosDrawer = ({ datos_reserva, fnAsignarElemento }) => {
    const usuario = JSON.parse(localStorage.getItem("service_user") || "{}");
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

    const {
        fnAbrirDrawerConsumosDepartamento,
        abrirDrawerConsumosDepartamento,
    } = useUiConsumo();

    const { fnCargarConsumos, fnLimpiarConsumos } = useConsumoStore();
    const { fnCargarGastos, fnLimpiarGastos } = useGastoStore();
    const { fnCargarPagos, fnLimpiarPago } = usePagoStore();

    useEffect(() => {
        if (abrirDrawerConsumosDepartamento && datos_reserva) {
            fnCargarConsumos({ reserva_id: datos_reserva.reserva_id });

            if (
                usuario.role === Roles.GERENCIA ||
                usuario.role === Roles.ADMINISTRADOR
            ) {
                fnCargarGastos({ reserva_id: datos_reserva.reserva_id });
            }

            fnCargarPagos({ reserva_id: datos_reserva.reserva_id });
        }

        return () => {
            fnLimpiarConsumos();
            fnLimpiarGastos();
            fnLimpiarPago();
        };
    }, [abrirDrawerConsumosDepartamento, datos_reserva]);

    const handleCerrarDrawer = () => {
        fnAbrirDrawerConsumosDepartamento(false);
        fnAsignarElemento(null);
    };

    return (
        <>
            <Drawer
                opened={abrirDrawerConsumosDepartamento}
                onClose={handleCerrarDrawer}
                position={isMobile ? "bottom" : "right"}
                size={isMobile ? "95%" : "80%"}
                title={
                    <TextSection tt="" fz={isMobile ? 16 : 20} fw={500}>
                        Gestión de Consumos, Gastos y Pagos
                    </TextSection>
                }
                overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
                styles={{
                    body: {
                        padding: isMobile ? "0.5rem" : undefined,
                    },
                    header: {
                        padding: isMobile ? "0.75rem" : undefined,
                    },
                    content: {
                        height: isMobile ? "95vh" : undefined,
                        overflowY: "auto",
                    },
                }}
            >
                <Stack gap={isMobile ? "md" : "lg"}>
                    {/* Acciones de Reserva */}
                    <Card shadow="sm" p={isMobile ? "xs" : "md"} withBorder>
                        <ReservaAccionesTable
                            datos={datos_reserva}
                            usuario={usuario}
                        />
                    </Card>

                    {/* Información del huésped */}
                    <ReservaInfoHuespedTable datos={datos_reserva} />

                    {/* Tabla de Consumos */}
                    <ConsumosDrawerTable
                        estado={datos_reserva.estado.nombre_estado}
                    />

                    {/* Tabla de Pagos */}
                    <PagosTable estado={datos_reserva.estado.nombre_estado} />

                    {/* Tabla de Gastos (solo GERENCIA) */}
                    {usuario.role === Roles.GERENCIA ||
                    usuario.role === Roles.ADMINISTRADOR ? (
                        <GastoDrawerTable
                            estado={datos_reserva.estado.nombre_estado}
                        />
                    ) : null}
                </Stack>
            </Drawer>

            {/* Modales */}
            <ConsumoModal reserva_id={datos_reserva?.reserva_id} />
            <ConsumoEditarModal />
            <ConsumoEliminarModal />
            <ConsumoAplicarDescuentoModal />
        </>
    );
};

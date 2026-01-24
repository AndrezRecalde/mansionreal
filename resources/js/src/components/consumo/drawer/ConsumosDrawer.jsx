import { useEffect } from "react";
import { Card, Drawer, Stack } from "@mantine/core";
import {
    ConsumosDrawerTable,
    ConsumoModal,
    ConsumoEditarModal,
    ConsumoEliminarModal,
    ConsumoAplicarDescuentoModal, // ✅ NUEVO
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

            if (usuario.nombre_rol === Roles.GERENTE) {
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
                position="right"
                size="80%"
                title={
                    <TextSection tt="" fz={20} fw={500}>
                        Gestión de Consumos, Gastos y Pagos
                    </TextSection>
                }
                overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            >
                <Stack gap="lg">
                    {/* Acciones de Reserva */}
                    <Card shadow="sm" p="md" withBorder>
                        <ReservaAccionesTable datos={datos_reserva} />
                    </Card>
                    {/* Información del huésped */}
                    <ReservaInfoHuespedTable datos={datos_reserva} />

                    {/* Tabla de Consumos */}
                    <ConsumosDrawerTable
                        estado={datos_reserva.estado.nombre_estado}
                    />
                    {/* Tabla de Pagos */}
                    <PagosTable estado={datos_reserva.estado.nombre_estado} />
                    {/* Tabla de Gastos (solo GERENTE) */}
                    {usuario.nombre_rol === Roles.GERENTE && (
                        <GastoDrawerTable
                            estado={datos_reserva.estado.nombre_estado}
                        />
                    )}
                </Stack>
            </Drawer>
            {/* Modales */}
            <ConsumoModal reserva_id={datos_reserva?.reserva_id} />
            <ConsumoEditarModal />
            <ConsumoEliminarModal />
            <ConsumoAplicarDescuentoModal /> {/* ✅ NUEVO */}
        </>
    );
};

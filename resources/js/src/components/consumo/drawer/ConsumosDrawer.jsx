import { useEffect, useMemo, useCallback } from "react";
import { Card, Drawer, Stack } from "@mantine/core";
import { ConsumosDrawerTable } from "../table/ConsumosDrawerTable";
import {
    useConsumoStore,
    useGastoStore,
    usePagoStore,
    useUiConsumo,
} from "../../../hooks";
import {
    GastoDrawerTable,
    PagosTable,
    ReservaAccionesTable,
    ReservaInfoHuespedTable,
    TextSection,
} from "../../../components";
import { Roles } from "../../../helpers/getPrefix";

export const ConsumosDrawer = ({ datos_reserva, fnAsignarElemento }) => {
    // Memoizar el usuario para evitar re-parseos innecesarios
    const usuario = JSON.parse(localStorage.getItem("service_user") || "{}");

    const {
        fnAbrirDrawerConsumosDepartamento,
        abrirDrawerConsumosDepartamento,
    } = useUiConsumo();

    const { fnCargarConsumos, fnLimpiarConsumos } = useConsumoStore();
    const { fnCargarGastos, fnLimpiarGastos } = useGastoStore();
    const { fnCargarPagos, fnLimpiarPago } = usePagoStore();

    // Memoizar la verificación de rol
    const esRolAdministrativo = useMemo(
        () =>
            usuario?.role === Roles.GERENCIA ||
            usuario?.role === Roles.ADMINISTRADOR,
        [usuario?.role]
    );

    // Extraer el ID de reserva para evitar repetición
    const reservaId = datos_reserva?.reserva_id;

    // Cargar datos cuando se abre el drawer
    useEffect(() => {
        if (!abrirDrawerConsumosDepartamento || !reservaId) return;

        fnCargarConsumos({ reserva_id: reservaId });
        fnCargarPagos({ reserva_id: reservaId });

        if (esRolAdministrativo) {
            fnCargarGastos({ reserva_id: reservaId });
        }
        //console.log("aki");

        // Cleanup al cerrar o desmontar
        return () => {
            fnLimpiarConsumos();
            if (esRolAdministrativo) {
                fnLimpiarGastos();
                fnLimpiarPago();
            }
        };
    }, [abrirDrawerConsumosDepartamento]);

    // Memoizar el handler de cierre
    const handleCerrarDrawer = useCallback(() => {
        fnAsignarElemento(null);
        fnAbrirDrawerConsumosDepartamento(false);
    }, [fnAsignarElemento, fnAbrirDrawerConsumosDepartamento]);

    // Guard clause para evitar renderizar si no hay datos
    if (!datos_reserva) return null;

    return (
        <Drawer
            position="right"
            size={920}
            offset={8}
            radius="md"
            opened={abrirDrawerConsumosDepartamento}
            onClose={handleCerrarDrawer}
            title={
                <TextSection tt="" fz={18} fw={700}>
                    Historial Consumos
                </TextSection>
            }
            // Mejoras adicionales opcionales:
            overlayProps={{ opacity: 0.5, blur: 4 }}
            transitionProps={{ transition: "slide-left", duration: 200 }}
            closeOnClickOutside={false}
        >
            <Stack gap="md">
                <Card
                    withBorder
                    shadow="md"
                    radius="md"
                    padding="md"
                    //bg="gray. 3"
                >
                    <ReservaAccionesTable datos={datos_reserva} />
                </Card>

                <ReservaInfoHuespedTable datos={datos_reserva} />

                <ConsumosDrawerTable estado={datos_reserva.estado} />
                <PagosTable estado={datos_reserva.estado} />

                {esRolAdministrativo && (
                    <>
                        <GastoDrawerTable estado={datos_reserva.estado} />
                    </>
                )}
            </Stack>
        </Drawer>
    );
};

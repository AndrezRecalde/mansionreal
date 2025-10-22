import { useEffect, useState } from "react";
import { Container, Divider } from "@mantine/core";
import {
    FiltrarPorFechasForm,
    LimpiezaModal,
    LimpiezaTable,
    TitlePage,
} from "../../components";
import { useLimpiezaStore } from "../../hooks";

const LimpiezaPage = () => {
    const { fnCargarLimpiezas, cargando, fnLimpiarLimpiezas, limpiezas } =
        useLimpiezaStore();

    // Estado local para controlar la paginación
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    // Estado para mantener los filtros aplicados
    const [filtrosActuales, setFiltrosActuales] = useState({
        p_fecha_inicio: null,
        p_fecha_fin: null,
        p_anio: null,
    });

    // Bandera para saber si ya se ha filtrado al menos una vez
    const [haFiltrado, setHaFiltrado] = useState(false);

    // Cargar datos cuando cambia la paginación (solo si ya se filtró)
    useEffect(() => {
        if (haFiltrado) {
            fnCargarLimpiezas({
                ...filtrosActuales,
                page: pagination.pageIndex + 1, // Backend usa base 1
                per_page: pagination.pageSize,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.pageIndex, pagination.pageSize]);

    // Limpiar al desmontar el componente
    useEffect(() => {
        return () => {
            fnLimpiarLimpiezas();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handler para aplicar filtros
    const handleFiltrar = (filtros) => {
        // Marcar que ya se ha filtrado
        setHaFiltrado(true);

        // Guardar los filtros actuales
        setFiltrosActuales(filtros);

        // Resetear a la primera página cuando se aplican nuevos filtros
        setPagination({
            pageIndex: 0,
            pageSize: pagination.pageSize,
        });

        // Cargar con los nuevos filtros
        fnCargarLimpiezas({
            ...filtros,
            page: 1,
            per_page: pagination.pageSize,
        });
    };

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Historial de Limpiezas</TitlePage>
            <Divider my={10} />
            <FiltrarPorFechasForm
                titulo="Filtrar por fechas"
                cargando={cargando}
                fnHandleAction={handleFiltrar}
            />
            <LimpiezaTable
                pagination={pagination}
                setPagination={setPagination}
            />

            <LimpiezaModal />
        </Container>
    );
};

export default LimpiezaPage;

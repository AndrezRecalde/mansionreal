import { useEffect, useState } from "react";
import { Container, Divider } from "@mantine/core";
import {
    FiltrarPorFechasForm,
    LimpiezaModal,
    LimpiezaTable,
    TitlePage,
} from "../../components";
import { useLimpiezaStore, useTitleHook } from "../../hooks";
import { PAGE_TITLE } from "../../helpers/getPrefix";

const LimpiezaPage = () => {
    useTitleHook(PAGE_TITLE.LIMPIEZA.TITLE);
    const {
        fnCargarLimpiezas,
        cargando,
        ultimosFiltros,
        fnGuardarUltimosFiltros,
        fnLimpiarLimpiezas,
    } = useLimpiezaStore();

    // Estado local para controlar la paginación
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });


    // Bandera para saber si ya se ha filtrado al menos una vez
    const [haFiltrado, setHaFiltrado] = useState(false);

    // Cargar datos cuando cambia la paginación (solo si ya se filtró)
    useEffect(() => {
        if (haFiltrado) {
            fnCargarLimpiezas({
                ...ultimosFiltros,
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

        // Resetear a la primera página cuando se aplican nuevos filtros
        setPagination({
            pageIndex: 0,
            pageSize: pagination.pageSize,
        });
        fnGuardarUltimosFiltros({
            ...filtros,
            page: 1,
            per_page: pagination.pageSize,
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
            <TitlePage order={2}>{PAGE_TITLE.LIMPIEZA.TITLE_PAGE}</TitlePage>
            <Divider my={10} />
            <FiltrarPorFechasForm
                titulo={PAGE_TITLE.LIMPIEZA.BUTTONS.FILTRAR_LIMPIEZAS}
                cargando={cargando}
                fnHandleAction={handleFiltrar}
            />
            <LimpiezaTable
                pagination={pagination}
                setPagination={setPagination}
                PAGE_TITLE={PAGE_TITLE.LIMPIEZA.CAMPOS_TABLA}
            />

            {/*  Solo sirve para modificar al personal de limpieza */}
            <LimpiezaModal PAGE_TITLE={PAGE_TITLE.LIMPIEZA.CAMPOS_MODAL} />
        </Container>
    );
};

export default LimpiezaPage;

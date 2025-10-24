import { useEffect, useMemo } from "react";
import { Container, Divider } from "@mantine/core";
import {
    FiltrarPorGerentes,
    ReportesPagosTable,
    TitlePage,
} from "../../components";
import { useTitleHook, useUsuarioStore } from "../../hooks";

const ReportesGerentesPage = () => {
    useTitleHook("Reportes de Gerentes - Mansion Real");
    const usuario = useMemo(() => {
        const storedUser = localStorage.getItem("service_user");
        return storedUser ? JSON.parse(storedUser) : null;
    }, []);
    const { fnCargarGerentes, reportes, fnCargarReportes, fnLimpiarUsuarios } =
        useUsuarioStore();

    useEffect(() => {
        fnCargarGerentes();

        return () => {
            fnLimpiarUsuarios();
        };
    }, []);


    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Reportes de Gerente</TitlePage>
            <Divider my={10} />
            <FiltrarPorGerentes
                titulo="Filtrar por Gerente"
                usuario={usuario}
                cargando={false}
                fnHandleAction={fnCargarReportes}
            />
            {reportes.length !== 0 && (
                <ReportesPagosTable reportes={reportes} />
            )}
        </Container>
    );
};

export default ReportesGerentesPage;

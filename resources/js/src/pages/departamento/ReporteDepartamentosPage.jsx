import { Container, Divider } from "@mantine/core";
import {
    ConsultarReservaSection,
    FiltrarPorFechasForm,
    TitlePage,
} from "../../components";
import {
    useConsumoStore,
    useDashboardKPIStore,
    useDepartamentoStore,
    useStorageField,
} from "../../hooks";
import { useEffect } from "react";
import Swal from "sweetalert2";

const ReporteDepartamentosPage = () => {
    const {
        cargando,
        cargandoExportacion,
        fnCargarReporteDepartamentosPorFechas,
        fnLimpiarDepartamentos,
    } = useDepartamentoStore();
    const { fnCargarResumenKPI, fnLimpiarResumenKPI } = useDashboardKPIStore();
    const { fnSetStorageFields } = useStorageField();

    useEffect(() => {
        return () => {
            fnLimpiarDepartamentos();
            fnLimpiarResumenKPI();
            fnSetStorageFields(null);
        };
    }, []);

    useEffect(() => {
        if (cargandoExportacion === true) {
            Swal.fire({
                icon: "warning",
                text: "Un momento porfavor, se está exportando",
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
        } else {
            Swal.close(); // Cierra el modal cuando isExport es false
        }
    }, [cargandoExportacion]);

    return (
        <Container size="lg" my={20}>
            <TitlePage order={2}>Reporte Departamentos</TitlePage>
            <Divider my={10} />
            <FiltrarPorFechasForm
                titulo="Filtrar por fechas"
                cargando={cargando}
                fnHandleAction={(values) => {
                    fnCargarReporteDepartamentosPorFechas(values);
                    fnCargarResumenKPI(values);
                    fnSetStorageFields(values);
                }}
            />
            {/* <ConsultarReservaSection /> */}
            <ConsultarReservaSection />
        </Container>
    );
};

export default ReporteDepartamentosPage;

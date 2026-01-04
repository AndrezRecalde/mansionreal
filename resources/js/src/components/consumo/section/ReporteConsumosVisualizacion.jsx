import { useState } from "react";
import {
    Stack,
    Alert,
    LoadingOverlay,
    Box,
    Group,
    SegmentedControl,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import {
    IconAlertCircle,
    IconFileTypePdf,
    IconTable,
    IconCategory,
} from "@tabler/icons-react";
import {
    MetadatosSection,
    ReporteProductosTable,
    ReporteConsolidadoTable,
    TotalesGeneralesSection,
    BtnSection,
    TitlePage,
} from "../../../components";

export const ReporteConsumosVisualizacion = ({
    reporteData,
    cargandoPDF,
    onExportPDF,
}) => {
    const { colorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();
    const [vistaActiva, setVistaActiva] = useState("categorias"); // 'categorias' | 'consolidado'

    if (!reporteData) {
        return (
            <Alert
                icon={<IconAlertCircle size={16} />}
                title="Sin datos"
                color="gray"
                mt="xl"
            >
                No hay datos para mostrar. Por favor, seleccione un rango de
                fechas y presione "Buscar".
            </Alert>
        );
    }

    const { metadatos, categorias, totales_generales } = reporteData;

    if (categorias.length === 0) {
        return (
            <Alert
                icon={<IconAlertCircle size={16} />}
                title="Sin resultados"
                color="yellow"
                mt="xl"
            >
                No se encontraron consumos para el período seleccionado.
            </Alert>
        );
    }

    return (
        <Box pos="relative">
            <LoadingOverlay
                visible={cargandoPDF}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ children: "Generando PDF..." }}
            />

            <Stack gap="xl" mt="xl">
                {/* Metadatos */}
                <MetadatosSection metadatos={metadatos} />

                {/* Controles superiores */}
                <Group justify="space-between">
                    <SegmentedControl
                        value={vistaActiva}
                        onChange={setVistaActiva}
                        data={[
                            {
                                label: (
                                    <Group
                                        grow
                                        preventGrowOverflow={false}
                                        wrap="nowrap"
                                    >
                                        <IconCategory size={15} />
                                        <span>Por Categorías</span>
                                    </Group>
                                ),
                                value: "categorias",
                            },
                            {
                                label: (
                                    <Group
                                        grow
                                        preventGrowOverflow={false}
                                        wrap="nowrap"
                                    >
                                        <IconTable size={15} />
                                        <span>Vista Consolidada</span>
                                    </Group>
                                ),
                                value: "consolidado",
                            },
                        ]}
                    />

                    <BtnSection
                        IconSection={IconFileTypePdf}
                        iconSize={20}
                        variant="default"
                        handleAction={onExportPDF}
                    >
                        Exportar a PDF
                    </BtnSection>
                </Group>

                {/* Vista por categorías */}
                {vistaActiva === "categorias" && (
                    <>
                        <TitlePage order={3}>Detalle por Categorías</TitlePage>

                        {categorias.map((categoria) => (
                            <ReporteProductosTable
                                key={categoria.categoria_id}
                                categoria={categoria}
                                colorScheme={colorScheme}
                                theme={theme}
                            />
                        ))}
                    </>
                )}

                {/* Vista consolidada */}
                {vistaActiva === "consolidado" && (
                    <>
                        <TitlePage order={3}>
                            Vista Consolidada - Todos los Productos
                        </TitlePage>

                        <ReporteConsolidadoTable
                            categorias={categorias}
                            colorScheme={colorScheme}
                            theme={theme}
                        />
                    </>
                )}

                {/* Totales generales */}
                <TotalesGeneralesSection
                    totales={totales_generales}
                    colorScheme={colorScheme}
                    theme={theme}
                />
            </Stack>
        </Box>
    );
};

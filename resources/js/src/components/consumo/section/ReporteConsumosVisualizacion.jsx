import { useState } from "react";
import {
    Stack,
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
    AlertSection,
} from "../../../components";
import { PAGE_TITLE } from "../../../helpers/getPrefix";

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
            <AlertSection
                icon={IconAlertCircle}
                title={
                    PAGE_TITLE.REPORTE_CONSUMOS.ALERTS_SECTION.SIN_DATOS_ALERT
                        .TITLE
                }
                color={
                    PAGE_TITLE.REPORTE_CONSUMOS.ALERTS_SECTION.SIN_DATOS_ALERT
                        .COLOR
                }
            >
                {
                    PAGE_TITLE.REPORTE_CONSUMOS.ALERTS_SECTION.SIN_DATOS_ALERT
                        .MESSAGE
                }
            </AlertSection>
        );
    }

    const { metadatos, categorias, totales_generales } = reporteData;

    if (categorias.length === 0) {
        return (
            <AlertSection
                icon={IconAlertCircle}
                title={
                    PAGE_TITLE.REPORTE_CONSUMOS.ALERTS_SECTION.NOT_FOUND_ALERT
                        .TITLE
                }
                color={
                    PAGE_TITLE.REPORTE_CONSUMOS.ALERTS_SECTION.NOT_FOUND_ALERT
                        .COLOR
                }
            >
                {
                    PAGE_TITLE.REPORTE_CONSUMOS.ALERTS_SECTION.NOT_FOUND_ALERT
                        .MESSAGE
                }
            </AlertSection>
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
                <MetadatosSection
                    metadatos={metadatos}
                    PAGE_TITLE={PAGE_TITLE}
                />

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
                                        <span>
                                            {
                                                PAGE_TITLE.REPORTE_CONSUMOS
                                                    .SEGMENTED_CONTROL
                                                    .POR_CATEGORIAS
                                            }
                                        </span>
                                    </Group>
                                ),
                                value: PAGE_TITLE.REPORTE_CONSUMOS
                                    .SEGMENTED_CONTROL.VALUE_CATEGORIAS,
                            },
                            {
                                label: (
                                    <Group
                                        grow
                                        preventGrowOverflow={false}
                                        wrap="nowrap"
                                    >
                                        <IconTable size={15} />
                                        <span>
                                            {
                                                PAGE_TITLE.REPORTE_CONSUMOS
                                                    .SEGMENTED_CONTROL
                                                    .CONSOLIDADO
                                            }
                                        </span>
                                    </Group>
                                ),
                                value: PAGE_TITLE.REPORTE_CONSUMOS
                                    .SEGMENTED_CONTROL.VALUE_CONSOLIDADO,
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
                {vistaActiva ===
                    PAGE_TITLE.REPORTE_CONSUMOS.SEGMENTED_CONTROL
                        .VALUE_CATEGORIAS && (
                    <>
                        <TitlePage order={3}>
                            {
                                PAGE_TITLE.REPORTE_CONSUMOS.SECCIONES
                                    .SECCION_CATEGORIAS
                            }
                        </TitlePage>

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
                {vistaActiva ===
                    PAGE_TITLE.REPORTE_CONSUMOS.SEGMENTED_CONTROL
                        .VALUE_CONSOLIDADO && (
                    <>
                        <TitlePage order={3}>
                            {
                                PAGE_TITLE.REPORTE_CONSUMOS.SECCIONES
                                    .SECCION_CONSOLIDADO
                            }
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

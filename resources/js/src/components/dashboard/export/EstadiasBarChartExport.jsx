import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import html2canvas from "html2canvas";

export default function EstadiasBarChartExport({ estadias, onImageGenerated }) {
    const chartRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (chartRef.current && estadias && estadias.length > 0) {
            const data = estadias[0];

            // Renderizar el gráfico
            Highcharts.chart(chartRef.current, {
                chart: {
                    type: "bar",
                    height: 400,
                    width: 900,
                    backgroundColor: "#FFFFFF",
                    style: {
                        fontFamily: "'Poppins', 'Inter', sans-serif",
                    },
                },
                title: {
                    text: "Resumen de Estadías",
                    align: "center",
                    style: {
                        color: "#1A1B1E",
                        fontWeight: "700",
                        fontSize: "20px",
                    },
                },
                subtitle: {
                    text: "Métricas principales del período",
                    align: "center",
                    style: {
                        color: "#636E72",
                        fontSize: "13px",
                    },
                },
                xAxis: {
                    categories: [
                        "Total Estadías",
                        "Subtotal Consumos",
                        "IVA Recaudado",
                        "Total Consumos",
                        "Total Huéspedes",
                    ],
                    title: {
                        text: null,
                    },
                    labels: {
                        style: {
                            fontSize: "12px",
                            color: "#495057",
                            fontWeight: "500",
                        },
                    },
                    gridLineColor: "rgba(0, 0, 0, 0.05)",
                    lineColor: "#DEE2E6",
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Valores",
                        align: "high",
                        style: {
                            color: "#495057",
                            fontWeight: "600",
                        },
                    },
                    labels: {
                        overflow: "justify",
                        style: {
                            color: "#495057",
                        },
                    },
                    gridLineColor: "rgba(0, 0, 0, 0.08)",
                },
                tooltip: {
                    enabled: false,
                },
                plotOptions: {
                    bar: {
                        borderRadius: 3,
                        borderWidth: 1,
                        borderColor: "rgba(0, 0, 0, 0.2)",
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: "11px",
                                fontWeight: "700",
                                color: "#2D3436",
                                textOutline: "1px #FFFFFF",
                            },
                            formatter: function () {
                                const isCurrency =
                                    this.point.index !== 0 &&
                                    this.point.index !== 4;
                                return (
                                    (isCurrency ? "$" : "") +
                                    Highcharts.numberFormat(this.y, 2)
                                );
                            },
                        },
                    },
                    series: {
                        animation: false,
                    },
                },
                legend: {
                    enabled: false,
                },
                credits: {
                    enabled: false,
                },
                series: [
                    {
                        name: "Valores",
                        data: [
                            {
                                y: parseFloat(data.total_estadias),
                                color: "#E74C3C",
                            },
                            {
                                y: parseFloat(data.subtotal_consumos),
                                color: "#2ECC71",
                            },
                            {
                                y: parseFloat(data.iva_recaudado),
                                color: "#F39C12",
                            },
                            {
                                y: parseFloat(data.total_consumos),
                                color: "#9B59B6",
                            },
                            {
                                y: parseFloat(data.total_huespedes),
                                color: "#3498DB",
                            },
                        ],
                    },
                ],
            });

            // Capturar como imagen después de renderizar
            const timer = setTimeout(async () => {
                if (containerRef.current) {
                    try {
                        const canvas = await html2canvas(containerRef.current, {
                            backgroundColor: "#FFFFFF",
                            scale: 3,
                            logging: false,
                            useCORS: true,
                        });

                        const dataURL = canvas.toDataURL("image/png", 1.0);
                        onImageGenerated(dataURL);
                    } catch (error) {
                        console.error(
                            "Error generando imagen del gráfico de estadías:",
                            error
                        );
                    }
                }
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [estadias, onImageGenerated]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                left: "-9999px",
                width: "920px",
                backgroundColor: "#FFFFFF",
                padding: "10px",
            }}
        >
            <div ref={chartRef}></div>
        </div>
    );
}

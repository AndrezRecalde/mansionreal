import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import { useEstadiaStore } from "../../hooks";
import { useMantineColorScheme } from "@mantine/core";

const EstadiasBarChart = () => {
    const { estadias } = useEstadiaStore();
    const chartRef = useRef(null);
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        if (chartRef.current && estadias && estadias.length > 0) {
            const data = estadias[0];

            Highcharts.chart(chartRef.current, {
                chart: {
                    type: "bar",
                    height: 450,
                    backgroundColor: "transparent",
                    style: {
                        fontFamily:
                            "'Poppins', 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    },
                },
                title: {
                    text: "Resumen de Estadías",
                    align: "left",
                    style: {
                        color: isDark ? "#F8F9FA" : "#1A1B1E",
                        fontWeight: "700",
                        fontSize: "24px",
                        letterSpacing: "-0.5px",
                    },
                },
                subtitle: {
                    text: "Métricas principales del período",
                    align: "left",
                    style: {
                        color: isDark ? "#909296" : "#636E72",
                        fontSize: "14px",
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
                            color: isDark ? "#C1C2C5" : "#495057",
                            fontWeight: "500",
                        },
                    },
                    gridLineColor: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.05)",
                    lineColor: isDark ? "#373A40" : "#DEE2E6",
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Valores",
                        align: "high",
                        style: {
                            color: isDark ? "#C1C2C5" : "#495057",
                            fontWeight: "600",
                        },
                    },
                    labels: {
                        overflow: "justify",
                        style: {
                            color: isDark ? "#C1C2C5" : "#495057",
                        },
                    },
                    gridLineColor: isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.08)",
                },
                tooltip: {
                    backgroundColor: isDark
                        ? "rgba(26, 27, 30, 0.95)"
                        : "rgba(0, 0, 0, 0.85)",
                    borderRadius: 5,
                    borderWidth: 0,
                    shadow: {
                        color: "rgba(0, 0, 0, 0.3)",
                        offsetX: 0,
                        offsetY: 4,
                        width: 10,
                    },
                    style: {
                        color: "#FFFFFF",
                        fontSize: "14px",
                        fontWeight: "500",
                    },
                    formatter: function () {
                        const isCurrency =
                            this.point.index !== 0 && this.point.index !== 4;
                        return (
                            "<b>" +
                            this.point.category +
                            "</b><br/>" +
                            '<span style="color:' +
                            this.point.color +
                            '">●</span> ' +
                            (isCurrency ? "$" : "") +
                            Highcharts.numberFormat(this.y, 2) +
                            (isCurrency ? "" : " unidades")
                        );
                    },
                },
                plotOptions: {
                    bar: {
                        borderRadius: 3,
                        borderWidth: 2,
                        borderColor: isDark
                            ? "rgba(0, 0, 0, 0.6)"
                            : "rgba(0, 0, 0, 0.4)",
                        shadow: {
                            color: isDark
                                ? "rgba(0, 0, 0, 0.5)"
                                : "rgba(0, 0, 0, 0.15)",
                            offsetX: 0,
                            offsetY: 3,
                            width: 6,
                        },
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: "13px",
                                fontWeight: "700",
                                color: isDark ? "#F8F9FA" : "#2D3436",
                                textOutline: isDark
                                    ? "2px #1A1B1E"
                                    : "2px #FFFFFF",
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
                        states: {
                            hover: {
                                brightness: 0.08,
                                borderColor: isDark ? "#FFFFFF" : "#000000",
                            },
                        },
                    },
                    series: {
                        animation: {
                            duration: 1000,
                        },
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
                                color: "#E74C3C", // Rojo intenso
                            },
                            {
                                y: parseFloat(data.subtotal_consumos),
                                color: "#2ECC71", // Verde esmeralda
                            },
                            {
                                y: parseFloat(data.iva_recaudado),
                                color: "#F39C12", // Naranja dorado
                            },
                            {
                                y: parseFloat(data.total_consumos),
                                color: "#9B59B6", // Púrpura real
                            },
                            {
                                y: parseFloat(data.total_huespedes),
                                color: "#3498DB", // Azul brillante
                            },
                        ],
                    },
                ],
            });
        }
    }, [estadias, isDark]); // Agregado isDark para actualizar cuando cambie el tema

    return (
        <div>
            <div
                ref={chartRef}
                style={{
                    padding: "20px",
                    borderRadius: "12px",
                    background: isDark
                        ? "linear-gradient(135deg, #1A1B1E 0%, #25262B 100%)"
                        : "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
                    boxShadow: isDark
                        ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                        : "0 4px 20px rgba(0, 0, 0, 0.08)",
                    border: isDark ? "1px solid #373A40" : "none",
                }}
            ></div>
        </div>
    );
};

export default EstadiasBarChart;

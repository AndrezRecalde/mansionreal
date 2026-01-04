import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMantineColorScheme } from "@mantine/core";
import { useDashRankingProductosStore } from "../../hooks";

export default function ProductPieChart() {
    const { rankingProductos } = useDashRankingProductosStore();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    // Paleta de colores VIBRANTES pero menos eléctricos
    const colores = [
        "#0B1E40", // Navy corporativo
        "#102A56", // Azul institucional
        "#345995", // Azul confianza
        "#8DA9C4", // Azul suave neutro
        "#F4D35E", // Dorado premium
        "#EE964B", // Naranja financiero
        "#C81D25", // Rojo énfasis (riesgo/alerta)
        "#6C757D", // Gris corporativo
        "#2A628F", // Azul moderno
        "#184E77", // Acabado ejecutivo
    ];

    // Ordenar productos por cantidad vendida (mayor a menor)
    const productosOrdenados = [...rankingProductos].sort(
        (a, b) =>
            parseInt(b.cantidad_vendida, 10) - parseInt(a.cantidad_vendida, 10)
    );

    const options = {
        chart: {
            type: "pie",
            backgroundColor: "transparent",
            height: 450,
            style: {
                fontFamily:
                    "'Poppins','Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            },
        },
        title: {
            text: "Consumo por Producto",
            style: {
                color: isDark ? "#F8F9FA" : "#1A1B1E",
                fontWeight: "700",
                fontSize: "24px",
                letterSpacing: "-0.5px",
            },
        },
        subtitle: {
            text: "Distribución de ventas por categoría",
            style: {
                color: isDark ? "#909296" : "#636E72",
                fontSize: "14px",
            },
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
            pointFormat:
                '<span style="color:{point.color}">●</span> <b>{point.y}</b> unidades vendidas<br/><span style="font-size:12px; opacity:0.8">{point.percentage:.1f}% del total</span>',
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                borderWidth: 2,
                borderColor: isDark
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(0, 0, 0, 0.4)",
                slicedOffset: 15,
                size: "85%",
                startAngle: -90, // Comienza desde arriba (12 en punto)
                shadow: {
                    color: isDark
                        ? "rgba(0, 0, 0, 0.5)"
                        : "rgba(0, 0, 0, 0.15)",
                    offsetX: 0,
                    offsetY: 3,
                    width: 8,
                },
                dataLabels: [
                    {
                        enabled: true,
                        distance: 30,
                        format: "<b>{point.name}</b><br/>{point.percentage:.1f}%",
                        style: {
                            fontSize: "13px",
                            fontWeight: "600",
                            textOutline: isDark ? "3px #1A1B1E" : "3px #FFFFFF",
                            color: isDark ? "#F8F9FA" : "#2D3436",
                        },
                        connectorColor: isDark
                            ? "rgba(200, 200, 200, 0.4)"
                            : "rgba(128, 128, 128, 0.5)",
                        connectorWidth: 2,
                        connectorPadding: 8,
                    },
                    {
                        enabled: true,
                        distance: -45,
                        format: "{point.percentage:.0f}%",
                        style: {
                            fontSize: "14px",
                            fontWeight: "700",
                            textOutline: "none",
                            color: "#FFFFFF",
                            textShadow: "0px 2px 4px rgba(0, 0, 0, 0.8)",
                        },
                        filter: {
                            operator: ">",
                            property: "percentage",
                            value: 8,
                        },
                    },
                ],
                states: {
                    hover: {
                        brightness: 0.08,
                        halo: {
                            size: 8,
                            opacity: 0.15,
                            attributes: {
                                fill: isDark
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(0, 0, 0, 0.1)",
                            },
                        },
                    },
                    select: {
                        color: null,
                        borderColor: isDark ? "#FFFFFF" : "#000000",
                        borderWidth: 1.5,
                    },
                    inactive: {
                        opacity: 0.5,
                    },
                },
                point: {
                    events: {
                        mouseOver: function () {
                            if (this.graphic) {
                                this.graphic.attr({
                                    opacity: 0.95,
                                });
                            }
                        },
                        mouseOut: function () {
                            if (this.graphic) {
                                this.graphic.attr({
                                    opacity: 1,
                                });
                            }
                        },
                    },
                },
            },
        },
        credits: {
            enabled: false,
        },
        series: [
            {
                name: "Consumo",
                colorByPoint: true,
                innerSize: "0%",
                data: productosOrdenados.map((item, idx) => ({
                    name: item.nombre_producto,
                    y: parseInt(item.cantidad_vendida, 10),
                    color: colores[idx % colores.length],
                    sliced: idx === 0, // El producto con mayor venta aparece separado
                    selected: idx === 0,
                })),
            },
        ],
    };

    return (
        <div
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
        >
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}

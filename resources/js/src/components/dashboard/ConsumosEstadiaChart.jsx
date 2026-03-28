import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useDashResumenConsumosEstadiaStore } from "../../hooks";
import { useMantineColorScheme } from "@mantine/core";

export default function ConsumosEstadiaChart() {
    const { resumenConsumosEstadia } = useDashResumenConsumosEstadiaStore();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    // Categorías dinámicas según la data
    const categorias = resumenConsumosEstadia.map(
        (item) => item.nombre_producto,
    );

    // Datos dinámicos
    const dataCantidad = resumenConsumosEstadia.map((item) =>
        parseFloat(item.total_cantidad),
    );
    
    const dataMonto = resumenConsumosEstadia.map((item) =>
        parseFloat(item.total_monto),
    );

    const options = {
        chart: {
            type: "column",
            backgroundColor: "transparent",
            height: 450,
            style: {
                fontFamily:
                    "'Poppins', 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            },
        },
        title: {
            text: "Resumen Consumos Estadía",
            align: "left",
            style: {
                color: isDark ? "#F8F9FA" : "#1A1B1E",
                fontWeight: "700",
                fontSize: "24px",
                letterSpacing: "-0.5px",
            },
        },
        subtitle: {
            text: "Facturados (Emitidos) por Producto en Inventario",
            align: "left",
            style: {
                color: isDark ? "#909296" : "#636E72",
                fontSize: "14px",
            },
        },
        xAxis: {
            categories: categorias,
            title: {
                text: "Productos",
            },
            labels: {
                style: {
                    fontSize: "13px",
                    fontWeight: "500",
                    color: isDark ? "#C1C2C5" : "#495057",
                },
            },
            gridLineColor: isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
            lineColor: isDark ? "#373A40" : "#DEE2E6",
        },
        yAxis: [
            {
                title: {
                    text: "Monto Recaudado",
                    style: {
                        color: isDark ? "#C1C2C5" : "#495057",
                        fontWeight: "600",
                        fontSize: "14px",
                    },
                },
                labels: {
                    style: {
                        color: isDark ? "#C1C2C5" : "#495057",
                    },
                    formatter: function () {
                        return "$" + Highcharts.numberFormat(this.value, 0);
                    },
                },
                gridLineColor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.08)",
            },
            {
                title: {
                    text: "Cantidad Consumida",
                    style: {
                        color: isDark ? "#C1C2C5" : "#495057",
                        fontWeight: "600",
                        fontSize: "14px",
                    },
                },
                labels: {
                    style: {
                        color: isDark ? "#C1C2C5" : "#495057",
                    },
                },
                opposite: true,
                gridLineColor: "transparent",
            }
        ],
        tooltip: {
            backgroundColor: isDark
                ? "rgba(26, 27, 30, 0.95)"
                : "rgba(0, 0, 0, 0.85)",
            borderRadius: 3,
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
            shared: true,
        },
        plotOptions: {
            column: {
                borderRadius: 2,
                borderWidth: 1.5,
                borderColor: isDark
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(0, 0, 0, 0.4)",
            },
        },
        legend: {
            itemStyle: {
                color: isDark ? "#E5E8EC" : "#2D3436",
                fontWeight: "600",
            },
            itemHoverStyle: {
                color: isDark ? "#FFFFFF" : "#000000",
            },
        },
        credits: {
            enabled: false,
        },
        series: [
            {
                name: "Recaudación ($)",
                type: "column",
                yAxis: 0,
                data: dataMonto,
                color: "#4A90E2", // Acento
                tooltip: {
                    valuePrefix: "$",
                    valueDecimals: 2
                },
                dataLabels: {
                    enabled: true,
                    format: "${y:,.2f}",
                    style: {
                        fontSize: "11px",
                        fontWeight: "700",
                        color: isDark ? "#F8F9FA" : "#2D3436",
                        textOutline: isDark ? "2px #1A1B1E" : "2px #FFFFFF",
                    },
                },
            },
            {
                name: "Cantidad",
                type: "line",
                yAxis: 1,
                data: dataCantidad,
                color: "#F0AD4E", // Naranja
                marker: {
                    enabled: true,
                    radius: 4,
                },
                tooltip: {
                    valueSuffix: " unds",
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: "11px",
                        fontWeight: "600",
                        color: isDark ? "#F8F9FA" : "#2D3436",
                        textOutline: isDark ? "2px #1A1B1E" : "2px #FFFFFF",
                    },
                },
            },
        ],
    };

    return (
        <div
            style={{
                padding: "20px",
                borderRadius: "10px",
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

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useDashIngresosPorDepartamentoStore } from "../../hooks";
import { useMantineColorScheme } from "@mantine/core";
import { PAGE_TITLE } from "../../helpers/getPrefix";

export default function DepartmentBarChart() {
    const { ingresosPorDepartamento } = useDashIngresosPorDepartamentoStore();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    // Categorías dinámicas según la data
    const categorias = ingresosPorDepartamento.map(
        (item) => item.tipo_departamento,
    );

    // Datos dinámicos, convierte ingresos a número
    const data = ingresosPorDepartamento.map((item) =>
        parseFloat(item.ingresos),
    );

    // Paleta de colores vibrantes (igual al pie chart)
    const colores = [
        "#1B2635", // Primario oscuro
        "#2E4053", // Secundario
        "#4A90E2", // Acento
        "#5CB85C", // Éxito
        "#F0AD4E", // Advertencia
        "#D9534F", // Error
        "#E5E8EC", // Neutro claro
        "#A6B0BF", // Neutro medio
        "#34495E", // Neutro oscuro
    ];

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
            text: PAGE_TITLE.DASHBOARD.CHART_INGRESOS_DEPARTAMENTO.TITLE,
            align: "left",
            style: {
                color: isDark ? "#F8F9FA" : "#1A1B1E",
                fontWeight: "700",
                fontSize: "24px",
                letterSpacing: "-0.5px",
            },
        },
        subtitle: {
            text: PAGE_TITLE.DASHBOARD.CHART_INGRESOS_DEPARTAMENTO.SUBTITLE,
            align: "left",
            style: {
                color: isDark ? "#909296" : "#636E72",
                fontSize: "14px",
            },
        },
        xAxis: {
            categories: categorias,
            title: {
                text: PAGE_TITLE.DASHBOARD.CHART_INGRESOS_DEPARTAMENTO.X_AXIS,
                style: {
                    color: isDark ? "#C1C2C5" : "#495057",
                    fontWeight: "600",
                    fontSize: "14px",
                },
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
        yAxis: {
            title: {
                text: PAGE_TITLE.DASHBOARD.CHART_INGRESOS_DEPARTAMENTO.Y_AXIS,
                style: {
                    color: isDark ? "#C1C2C5" : "#495057",
                    fontWeight: "600",
                    fontSize: "14px",
                },
            },
            labels: {
                style: {
                    fontSize: "13px",
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
            pointFormat:
                '<span style="color:{point.color}">●</span> Ingresos: <b>${point.y:,.2f}</b>',
        },
        plotOptions: {
            column: {
                colorByPoint: true,
                colors: colores,
                borderRadius: 3,
                borderWidth: 1.5,
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
                    format: "${y:,.2f}",
                    style: {
                        fontSize: "13px",
                        fontWeight: "700",
                        color: isDark ? "#F8F9FA" : "#2D3436",
                        textOutline: isDark ? "2px #1A1B1E" : "2px #FFFFFF",
                    },
                },
                states: {
                    hover: {
                        brightness: 0.08,
                        borderColor: isDark ? "#FFFFFF" : "#000000",
                    },
                    inactive: {
                        opacity: 0.5,
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
                name: PAGE_TITLE.DASHBOARD.CHART_INGRESOS_DEPARTAMENTO.SERIES
                    .INGRESOS,
                data: data,
                colorByPoint: true,
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

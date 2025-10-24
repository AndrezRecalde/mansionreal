import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useDashIngresosPorDepartamentoStore } from "../../hooks";
import { useMantineColorScheme } from "@mantine/core";

export default function DepartmentBarChart() {
    const { ingresosPorDepartamento } = useDashIngresosPorDepartamentoStore();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    // Categorías dinámicas según la data
    const categorias = ingresosPorDepartamento.map(
        (item) => item.tipo_departamento
    );

    // Datos dinámicos, convierte ingresos a número
    const data = ingresosPorDepartamento.map((item) =>
        parseFloat(item.ingresos)
    );

    // Paleta de colores vibrantes (igual al pie chart)
    const colores = [
        "#E74C3C", // Rojo intenso
        "#3498DB", // Azul brillante
        "#F39C12", // Naranja dorado
        "#2ECC71", // Verde esmeralda
        "#9B59B6", // Púrpura real
        "#1ABC9C", // Turquesa
        "#E67E22", // Naranja calabaza
        "#34495E", // Azul grisáceo
        "#EC407A", // Rosa intenso
        "#26A69A", // Verde azulado
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
            text: "Ingresos por Departamento",
            align: "left",
            style: {
                color: isDark ? "#F8F9FA" : "#1A1B1E",
                fontWeight: "700",
                fontSize: "24px",
                letterSpacing: "-0.5px",
            },
        },
        subtitle: {
            text: "Distribución de ingresos por tipo de departamento",
            align: "left",
            style: {
                color: isDark ? "#909296" : "#636E72",
                fontSize: "14px",
            },
        },
        xAxis: {
            categories: categorias,
            title: {
                text: "Tipo de Departamento",
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
                text: "Ingresos (USD)",
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
                '<span style="color:{point.color}">●</span> Ingresos: <b>${point.y:,.2f}</b>',
        },
        plotOptions: {
            column: {
                colorByPoint: true,
                colors: colores,
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
                name: "Ingresos",
                data: data,
                colorByPoint: true,
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

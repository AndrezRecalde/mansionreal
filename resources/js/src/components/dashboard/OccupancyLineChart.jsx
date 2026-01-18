import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useDashHuepedGananciaStore } from "../../hooks";
import { useMantineColorScheme } from "@mantine/core";
import { meses, PAGE_TITLE } from "../../helpers/getPrefix";

export default function OccupancyLineChart() {
    const { huespedesGananciasMes } = useDashHuepedGananciaStore();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";

    // Asegura que siempre hay datos para todos los meses
    const huespedesPorMes = meses.map(
        (mes) =>
            huespedesGananciasMes.find((item) => item.nombre_mes === mes)
                ?.total_huespedes ?? 0
    );
    const gananciasPorMes = meses.map((mes) =>
        parseFloat(
            huespedesGananciasMes.find((item) => item.nombre_mes === mes)
                ?.total_ganancias ?? "0.00"
        )
    );

    const options = {
        chart: {
            zoomType: "xy",
            backgroundColor: "transparent",
            height: 450,
            style: {
                fontFamily:
                    "'Poppins', 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            },
        },
        title: {
            text: PAGE_TITLE.DASHBOARD.CHART_HUESPEDES_GANANCIAS.TITLE,
            align: "left",
            style: {
                color: isDark ? "#F8F9FA" : "#1A1B1E",
                fontWeight: "700",
                fontSize: "24px",
                letterSpacing: "-0.5px",
            },
        },
        subtitle: {
            text: PAGE_TITLE.DASHBOARD.CHART_HUESPEDES_GANANCIAS.SUBTITLE,
            align: "left",
            style: {
                color: isDark ? "#909296" : "#636E72",
                fontSize: "14px",
            },
        },
        xAxis: {
            categories: meses,
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
                // Eje Y para huéspedes
                title: {
                    text: PAGE_TITLE.DASHBOARD.CHART_HUESPEDES_GANANCIAS.Y_AXIS_HUESPEDES,
                    style: {
                        color: isDark ? "#C1C2C5" : "#495057",
                        fontWeight: "600",
                        fontSize: "14px",
                    },
                },
                min: 0,
                labels: {
                    style: {
                        fontSize: "13px",
                        color: isDark ? "#C1C2C5" : "#495057",
                    },
                },
                gridLineColor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.08)",
            },
            {
                // Eje Y para ganancias
                title: {
                    text: PAGE_TITLE.DASHBOARD.CHART_HUESPEDES_GANANCIAS.Y_AXIS_GANANCIAS,
                    style: {
                        color: isDark ? "#C1C2C5" : "#495057",
                        fontWeight: "600",
                        fontSize: "14px",
                    },
                },
                min: 0,
                opposite: true,
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
        ],
        tooltip: {
            shared: true,
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
                let huespedes =
                    this.points?.find((p) => p.series.name === PAGE_TITLE.DASHBOARD.CHART_HUESPEDES_GANANCIAS.SERIES.HUESPEDES)
                        ?.y ?? 0;
                let ganancias =
                    this.points?.find((p) => p.series.name === PAGE_TITLE.DASHBOARD.CHART_HUESPEDES_GANANCIAS.SERIES.GANANCIAS)
                        ?.y ?? 0;
                return `
                    <b>${meses[this.x]}</b><br/><br/>
                    <span style="color:#3498DB">●</span> Huéspedes: <b>${huespedes}</b><br/>
                    <span style="color:#2ECC71">●</span> Ganancias: <b>$${Highcharts.numberFormat(
                        ganancias,
                        2
                    )}</b>
                `;
            },
        },
        legend: {
            align: "center",
            verticalAlign: "bottom",
            itemStyle: {
                color: isDark ? "#C1C2C5" : "#495057",
                fontSize: "13px",
                fontWeight: "500",
            },
            itemHoverStyle: {
                color: isDark ? "#F8F9FA" : "#1A1B1E",
            },
        },
        credits: {
            enabled: false,
        },
        plotOptions: {
            column: {
                borderRadius: 1,
                borderWidth: 1,
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
                    enabled: false,
                },
                states: {
                    hover: {
                        brightness: 0.08,
                        borderColor: isDark ? "#FFFFFF" : "#000000",
                    },
                },
            },
            spline: {
                lineWidth: 3,
                marker: {
                    enabled: true,
                    radius: 5,
                    lineWidth: 2,
                    lineColor: isDark ? "#1A1B1E" : "#FFFFFF",
                },
                states: {
                    hover: {
                        lineWidth: 4,
                        halo: {
                            size: 10,
                            opacity: 0.25,
                        },
                    },
                },
                shadow: {
                    color: "rgba(46, 204, 113, 0.3)",
                    offsetX: 0,
                    offsetY: 2,
                    width: 4,
                },
            },
            series: {
                animation: {
                    duration: 1000,
                },
            },
        },
        series: [
            {
                name: PAGE_TITLE.DASHBOARD.CHART_HUESPEDES_GANANCIAS.SERIES.HUESPEDES,
                type: "column",
                data: huespedesPorMes,
                color: PAGE_TITLE.DASHBOARD.CHART_HUESPEDES_GANANCIAS.SERIES.COLOR_HUESPEDES, // Azul brillante
                yAxis: 0,
            },
            {
                name: PAGE_TITLE.DASHBOARD.CHART_HUESPEDES_GANANCIAS.SERIES.GANANCIAS,
                type: "spline",
                data: gananciasPorMes,
                color: PAGE_TITLE.DASHBOARD.CHART_HUESPEDES_GANANCIAS.SERIES.COLOR_GANANCIAS, // Verde esmeralda
                yAxis: 1,
                tooltip: {
                    valuePrefix: "$",
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

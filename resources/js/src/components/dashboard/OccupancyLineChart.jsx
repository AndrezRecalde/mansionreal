import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useDashHuepedGananciaStore } from "../../hooks";

export default function OccupancyLineChart() {
    const { huespedesGananciasMes } = useDashHuepedGananciaStore();

    // Lista completa de los nombres de los meses
    const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

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
        },
        title: {
            text: "Huéspedes y Ganancias Mensuales",
            style: { color: "#228be6", fontWeight: "bold" },
        },
        xAxis: {
            categories: meses,
            labels: {
                style: { fontSize: "14px", fontWeight: 600, color: "#a1a6ab" },
            },
        },
        yAxis: [
            {
                // Eje Y para huéspedes
                title: { text: "Total de Huéspedes" },
                min: 0,
                labels: { style: { fontSize: "14px", color: "#a1a6ab" } },
                gridLineColor: "#a1a6ab",
            },
            {
                // Eje Y para ganancias
                title: { text: "Total de Ganancias (USD)" },
                min: 0,
                opposite: true,
                labels: { style: { fontSize: "14px", color: "#a1a6ab" } },
                gridLineColor: "#a1a6ab",
            },
        ],
        tooltip: {
            shared: true,
            formatter: function () {
                let huespedes =
                    this.points?.find((p) => p.series.name === "Huéspedes")
                        ?.y ?? 0;
                let ganancias =
                    this.points?.find((p) => p.series.name === "Ganancias")
                        ?.y ?? 0;
                return `<b>${this.x}</b><br/>
                    Huéspedes: <b>${huespedes}</b><br/>
                    Ganancias: <b>$${ganancias.toFixed(2)}</b>`;
            },
        },
        series: [
            {
                name: "Huéspedes",
                type: "column",
                data: huespedesPorMes,
                color: "#1976d2",
                yAxis: 0,
            },
            {
                name: "Ganancias",
                type: "spline",
                data: gananciasPorMes,
                color: "#43ae7b",
                yAxis: 1,
                tooltip: {
                    valuePrefix: "$",
                },
            },
        ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
}

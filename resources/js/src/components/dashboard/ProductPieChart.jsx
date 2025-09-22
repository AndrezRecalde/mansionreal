import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useDashRankingProductosStore } from "../../hooks";

export default function ProductPieChart() {
    const { rankingProductos } = useDashRankingProductosStore();

    const colores = [
        "#4E79A7",
        "#F28E2B",
        "#E15759",
        "#76B7B2",
        "#59A14F",
        "#EDC949",
        "#AF7AA1",
        "#FF9DA7",
        "#9C755F",
        "#BAB0AC",
    ];

    const options = {
        chart: { type: "pie", backgroundColor: "transparent" },
        title: {
            text: "Consumo por Producto",
            style: { color: "#228be6", fontWeight: "bold" },
        },
        tooltip: {
            pointFormat: "<b>{point.y}</b> vendidos",
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                },
            },
        },
        series: [
            {
                name: "Consumo",
                colorByPoint: true,
                data: rankingProductos.map((item, idx) => ({
                    name: item.nombre_producto,
                    y: parseInt(item.cantidad_vendida, 10),
                    color: colores[idx % colores.length],
                })),
            },
        ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
}

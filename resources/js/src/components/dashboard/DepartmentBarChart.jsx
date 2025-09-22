import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useDashIngresosPorDepartamentoStore } from "../../hooks";

export default function DepartmentBarChart() {
    const { ingresosPorDepartamento } = useDashIngresosPorDepartamentoStore();

    // Categorías dinámicas según la data
    const categorias = ingresosPorDepartamento.map(
        (item) => item.tipo_departamento
    );

    // Datos dinámicos, convierte ingresos a número
    const data = ingresosPorDepartamento.map((item) =>
        parseFloat(item.ingresos)
    );

    // Genera un color diferente para cada barra (puedes personalizar la paleta)
    const colores = [
        "#43ae7b",
        "#228be6",
        "#f59f00",
        "#4E79A7",
        "#F28E2B",
        "#E15759",
        "#76B7B2",
        "#59A14F",
    ];

    const options = {
        chart: { type: "column", backgroundColor: "transparent" },
        title: {
            text: "Ingresos por Departamento",
            style: { color: "#228be6", fontWeight: "bold" },
        },
        xAxis: {
            categories: categorias.map((cat) => cat.visual),
            title: { text: "Tipo de Departamento" },
            labels: {
                style: { fontSize: "14px", fontWeight: 600, color: "#a1a6ab" },
            },
        },
        yAxis: {
            title: { text: "Ingresos (USD)" },
            labels: { style: { fontSize: "14px", color: "#a1a6ab" } },
            gridLineColor: "#dee2e6",
        },
        tooltip: {
            pointFormat: "Ingresos: <b>${point.y:.2f}</b>",
        },
        plotOptions: {
            column: {
                colorByPoint: true,
                colors: colores,
                dataLabels: {
                    enabled: true,
                    format: "${y:.2f}",
                    style: {
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#222",
                    },
                },
            },
        },
        series: [
            {
                name: "Ingresos",
                data: data,
                colorByPoint: true,
            },
        ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
}

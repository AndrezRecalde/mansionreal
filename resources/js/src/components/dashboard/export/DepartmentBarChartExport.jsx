import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import html2canvas from "html2canvas";

export default function DepartmentBarChartExport({
    ingresosPorDepartamento,
    onImageGenerated,
}) {
    const chartRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (containerRef.current) {
                try {
                    // Capturar el contenedor del gráfico como imagen
                    const canvas = await html2canvas(containerRef.current, {
                        backgroundColor: "#FFFFFF",
                        scale: 3, // Alta calidad
                        logging: false,
                        useCORS: true,
                    });

                    // Convertir a base64
                    const dataURL = canvas.toDataURL("image/png", 1.0);

                    // Enviar la imagen
                    onImageGenerated(dataURL);
                } catch (error) {
                    console.error("Error generando imagen del gráfico:", error);
                }
            }
        }, 3000); // Esperar 3 segundos para asegurar renderizado completo

        return () => clearTimeout(timer);
    }, [ingresosPorDepartamento, onImageGenerated]);

    const categorias = ingresosPorDepartamento.map(
        (item) => item.tipo_departamento
    );

    const data = ingresosPorDepartamento.map((item) =>
        parseFloat(item.ingresos)
    );

    const colores = [
        "#E74C3C",
        "#3498DB",
        "#F39C12",
        "#2ECC71",
        "#9B59B6",
        "#1ABC9C",
        "#E67E22",
        "#34495E",
        "#EC407A",
        "#26A69A",
    ];

    const options = {
        chart: {
            type: "column",
            backgroundColor: "#FFFFFF",
            height: 400,
            width: 900,
            style: {
                fontFamily: "'Poppins', 'Inter', sans-serif",
            },
        },
        title: {
            text: "Ingresos por Departamento",
            align: "center",
            style: {
                color: "#1A1B1E",
                fontWeight: "700",
                fontSize: "20px",
            },
        },
        subtitle: {
            text: "Distribución de ingresos por tipo de departamento",
            align: "center",
            style: {
                color: "#636E72",
                fontSize: "13px",
            },
        },
        xAxis: {
            categories: categorias,
            title: {
                text: "Tipo de Departamento",
                style: {
                    color: "#495057",
                    fontWeight: "600",
                    fontSize: "13px",
                },
            },
            labels: {
                style: {
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#495057",
                },
            },
            gridLineColor: "rgba(0, 0, 0, 0.05)",
            lineColor: "#DEE2E6",
        },
        yAxis: {
            title: {
                text: "Ingresos (USD)",
                style: {
                    color: "#495057",
                    fontWeight: "600",
                    fontSize: "13px",
                },
            },
            labels: {
                style: {
                    fontSize: "12px",
                    color: "#495057",
                },
                formatter: function () {
                    return "$" + Highcharts.numberFormat(this.value, 0);
                },
            },
            gridLineColor: "rgba(0, 0, 0, 0.08)",
        },
        tooltip: {
            enabled: false, // Desactivar para exportación
        },
        plotOptions: {
            column: {
                colorByPoint: true,
                colors: colores,
                borderRadius: 3,
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 0.2)",
                dataLabels: {
                    enabled: true,
                    format: "${y:,.2f}",
                    style: {
                        fontSize: "11px",
                        fontWeight: "700",
                        color: "#2D3436",
                        textOutline: "1px #FFFFFF",
                    },
                },
            },
            series: {
                animation: false, // Desactivar animación
            },
        },
        legend: {
            enabled: false,
        },
        credits: {
            enabled: false,
        },
        exporting: {
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
            ref={containerRef}
            style={{
                position: "absolute",
                left: "-9999px",
                width: "920px",
                backgroundColor: "#FFFFFF",
                padding: "10px",
            }}
        >
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartRef}
            />
        </div>
    );
}

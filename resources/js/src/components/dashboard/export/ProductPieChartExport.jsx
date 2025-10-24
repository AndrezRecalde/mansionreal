import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import html2canvas from "html2canvas";

export default function ProductPieChartExport({
    rankingProductos,
    onImageGenerated,
}) {
    const chartRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (containerRef.current) {
                try {
                    const canvas = await html2canvas(containerRef.current, {
                        backgroundColor: "#FFFFFF",
                        scale: 3,
                        logging: false,
                        useCORS: true,
                    });

                    const dataURL = canvas.toDataURL("image/png", 1.0);
                    onImageGenerated(dataURL);
                } catch (error) {
                    console.error(
                        "Error generando imagen del gráfico de productos:",
                        error
                    );
                }
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [rankingProductos, onImageGenerated]);

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

    const productosOrdenados = [...rankingProductos].sort(
        (a, b) =>
            parseInt(b.cantidad_vendida, 10) - parseInt(a.cantidad_vendida, 10)
    );

    const options = {
        chart: {
            type: "pie",
            backgroundColor: "#FFFFFF",
            height: 400,
            width: 700,
            style: {
                fontFamily: "'Poppins', 'Inter', sans-serif",
            },
        },
        title: {
            text: "Consumo por Producto",
            style: {
                color: "#1A1B1E",
                fontWeight: "700",
                fontSize: "20px",
            },
        },
        subtitle: {
            text: "Distribución de ventas por categoría",
            style: {
                color: "#636E72",
                fontSize: "13px",
            },
        },
        tooltip: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 0.2)",
                slicedOffset: 10,
                size: "80%",
                startAngle: -90,
                dataLabels: [
                    {
                        enabled: true,
                        distance: 20,
                        format: "<b>{point.name}</b><br/>{point.percentage:.1f}%",
                        style: {
                            fontSize: "11px",
                            fontWeight: "600",
                            textOutline: "2px #FFFFFF",
                            color: "#2D3436",
                        },
                        connectorColor: "rgba(128, 128, 128, 0.5)",
                        connectorWidth: 1,
                        connectorPadding: 5,
                    },
                    {
                        enabled: true,
                        distance: -30,
                        format: "{point.percentage:.0f}%",
                        style: {
                            fontSize: "12px",
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
            },
            series: {
                animation: false,
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
                    sliced: idx === 0,
                    selected: idx === 0,
                })),
            },
        ],
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                left: "-9999px",
                width: "720px",
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

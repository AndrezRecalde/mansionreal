import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function DepartmentBarChart() {
  const options = {
    chart: { type: 'column' },
    title: { text: null },
    xAxis: {
      categories: ['Simple', 'Doble', 'Suite'],
    },
    yAxis: {
      title: { text: 'Ingresos $' },
    },
    series: [{
      name: 'Ingresos',
      data: [5000, 7000, 3000],
      color: '#40c057',
    }]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

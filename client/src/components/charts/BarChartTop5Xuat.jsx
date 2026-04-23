import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartTop5Xuat = ({ data }) => {
  if (!data || data.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>Chưa có dữ liệu xuất kho</p>;
  }

  const chartData = {
    labels: data.map(d => d.TenHang),
    datasets: [
      {
        label: 'Tổng xuất',
        data: data.map(d => d.TongXuat),
        backgroundColor: [
          'rgba(79, 70, 229, 0.75)',
          'rgba(59, 130, 246, 0.75)',
          'rgba(16, 185, 129, 0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(239, 68, 68, 0.75)',
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: '#1e1e2e',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` Tổng xuất: ${ctx.parsed.x} đơn vị`,
        },
      },
    },
    scales: {
      x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { font: { size: 12 } } },
      y: { grid: { display: false }, ticks: { font: { size: 12 } } },
    },
  };

  return (
    <div style={{ height: '280px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChartTop5Xuat;

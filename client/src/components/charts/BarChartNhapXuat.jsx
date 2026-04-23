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

const BarChartNhapXuat = ({ data }) => {
  if (!data || data.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>Chưa có dữ liệu nhập/xuất</p>;
  }

  const chartData = {
    labels: data.map(d => d.thang),
    datasets: [
      {
        label: 'Nhập kho',
        data: data.map(d => d.nhap),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Xuất kho',
        data: data.map(d => d.xuat),
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, padding: 16, font: { size: 13 } } },
      title: { display: false },
      tooltip: { backgroundColor: '#1e1e2e', titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 12 } } },
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { font: { size: 12 } } },
    },
  };

  return (
    <div style={{ height: '280px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChartNhapXuat;

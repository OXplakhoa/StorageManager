import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Palette màu đa dạng, hài hòa với Indigo design system
const COLORS = [
  'rgba(79, 70, 229, 0.8)',   // Indigo
  'rgba(245, 158, 11, 0.8)',  // Amber
  'rgba(16, 185, 129, 0.8)',  // Emerald
  'rgba(239, 68, 68, 0.8)',   // Red
  'rgba(59, 130, 246, 0.8)',  // Blue
  'rgba(168, 85, 247, 0.8)',  // Purple
  'rgba(236, 72, 153, 0.8)',  // Pink
  'rgba(20, 184, 166, 0.8)',  // Teal
];

const PieChartHangHoa = ({ data }) => {
  if (!data || data.length === 0) {
    return <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>Chưa có dữ liệu</p>;
  }

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        position: 'right',
        labels: { usePointStyle: true, padding: 12, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: '#1e1e2e',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed} mặt hàng`,
        },
      },
    },
  };

  return (
    <div style={{ height: '280px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default PieChartHangHoa;

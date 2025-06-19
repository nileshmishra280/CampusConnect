import React, { useState, useEffect } from 'react';
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
import { TrendingUp, Users, Award, Calendar } from 'lucide-react';
import { fetchPlacementAnalytics } from '../../api/adminApi'; // Adjust path as needed

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PlacementAnalytics = () => {
  const [placementCounts, setPlacementCounts] = useState({ CSE: 0, ME: 0, EE: 0, TE: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchPlacementAnalytics();
        if (response.success) {
          setPlacementCounts(response.data);
        }
      } catch (error) {
        console.error('Error processing data:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxCount = Math.max(placementCounts.CSE, placementCounts.ME, placementCounts.EE, placementCounts.TE);
  const suggestedMax = maxCount > 10 ? Math.ceil(maxCount / 5) * 5 : 10;
  const totalPlacements = Object.values(placementCounts).reduce((sum, count) => sum + count, 0);

  const data = {
    labels: ['Computer Science', 'Mechanical', 'Electrical', 'Technology'],
    datasets: [
      {
        label: 'Placements in 2025',
        data: [placementCounts.CSE, placementCounts.ME, placementCounts.EE, placementCounts.TE],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 101, 101, 0.8)',
          'rgba(251, 191, 36, 0.8)'
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(16, 185, 129)',
          'rgb(245, 101, 101)',
          'rgb(251, 191, 36)'
        ],
        borderWidth: 3,
        borderRadius: {
          topLeft: 8,
          topRight: 8,
        },
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { 
          color: 'rgb(71, 85, 105)',
          font: { size: 14, weight: '500' },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        },
      },
      title: {
        display: true,
        text: 'Department-wise Placement Distribution',
        color: 'rgb(51, 65, 85)',
        font: { size: 18, weight: '600' },
        padding: { bottom: 30 }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: 'rgb(51, 65, 85)',
        bodyColor: 'rgb(71, 85, 105)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const percentage = totalPlacements > 0 ? ((context.parsed.y / totalPlacements) * 100).toFixed(1) : 0;
            return `${context.dataset.label}: ${context.parsed.y} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          color: 'rgb(100, 116, 139)',
          font: { size: 12 },
          callback: (value) => `${value}`,
        },
        grid: { 
          color: 'rgba(148, 163, 184, 0.2)',
          drawBorder: false
        },
        suggestedMax: suggestedMax,
      },
      x: {
        ticks: { 
          color: 'rgb(100, 116, 139)',
          font: { size: 12, weight: '500' }
        },
        grid: { display: false },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  // Dark mode options for chart
  const darkOptions = {
    ...options,
    plugins: {
      ...options.plugins,
      legend: {
        ...options.plugins.legend,
        labels: { 
          ...options.plugins.legend.labels,
          color: 'rgb(148, 163, 184)'
        }
      },
      title: {
        ...options.plugins.title,
        color: 'rgb(241, 245, 249)'
      },
      tooltip: {
        ...options.plugins.tooltip,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgb(241, 245, 249)',
        bodyColor: 'rgb(203, 213, 225)',
        borderColor: 'rgba(99, 102, 241, 0.5)'
      }
    },
    scales: {
      ...options.scales,
      y: {
        ...options.scales.y,
        ticks: {
          ...options.scales.y.ticks,
          color: 'rgb(148, 163, 184)'
        },
        grid: {
          ...options.scales.y.grid,
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      x: {
        ...options.scales.x,
        ticks: {
          ...options.scales.x.ticks,
          color: 'rgb(148, 163, 184)'
        }
      }
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-800/70 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-emerald-500 text-xs font-medium">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-gray-600 dark:text-slate-400 text-xs font-medium mb-1">{title}</h3>
      <p className="text-xl font-bold text-gray-900 dark:text-slate-100">{value}</p>
    </div>
  );

  const getTopDepartment = () => {
    const entries = Object.entries(placementCounts);
    if (entries.length === 0) return 'N/A';
    const topDept = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    return topDept[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-purple-500/30 border-t-blue-600 dark:border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-700 dark:text-slate-300 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Award className="w-8 h-8 text-blue-600 dark:text-purple-400" />
            <span className="text-blue-600 dark:text-purple-400 font-semibold text-lg">Academic Year 2025</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-600 bg-clip-text text-transparent mb-4">
            Placement Analytics
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Real-time insights into department-wise placement performance and trends
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={Users}
            title="Total Placements"
            value={totalPlacements}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend={totalPlacements > 0 ? "+12%" : null}
          />
          <StatCard
            icon={TrendingUp}
            title="Top Department"
            value={getTopDepartment()}
            color="bg-gradient-to-r from-indigo-500 to-indigo-600"
          />
          <StatCard
            icon={Calendar}
            title="Updated"
            value="June 19"
            color="bg-gradient-to-r from-amber-500 to-amber-600"
          />
        </div>

        {/* Chart Container */}
        <div className="bg-white/80 dark:bg-slate-800/30 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700/30 shadow-xl">
          <div className="h-80 sm:h-96 lg:h-[32rem] w-full">
            <Bar 
              data={data} 
              options={window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? darkOptions : options} 
            />
          </div>
        </div>

        {/* Department Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { dept: 'CSE', count: placementCounts.CSE, color: 'from-indigo-500 to-purple-600', icon: '💻' },
            { dept: 'ME', count: placementCounts.ME, color: 'from-emerald-500 to-teal-600', icon: '⚙️' },
            { dept: 'EE', count: placementCounts.EE, color: 'from-red-500 to-pink-600', icon: '⚡' },
            { dept: 'TE', count: placementCounts.TE, color: 'from-amber-500 to-orange-600', icon: '🔧' }
          ].map((item, index) => (
            <div key={index} className="bg-white/80 dark:bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-slate-700/30 hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{item.icon}</span>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white text-sm font-semibold`}>
                  {item.dept}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-1">{item.count}</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm">
                {totalPlacements > 0 ? ((item.count / totalPlacements) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacementAnalytics;
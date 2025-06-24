import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import { CompressionStats } from '../types';
import { formatFileSize } from '../utils/fileUtils';
import { TrendingDown, Clock, FileText, Gauge, CheckCircle, AlertTriangle, Zap, Target, Activity, BarChart3 } from 'lucide-react';

interface CompressionStatsProps {
  stats: CompressionStats;
}

export const CompressionStatsComponent: React.FC<CompressionStatsProps> = ({ stats }) => {
  const compressionPercentage = Math.round((1 - stats.compressionRatio) * 100);
  const isEffective = compressionPercentage >= 8;
  const isExcellent = compressionPercentage >= 20;

  const barData = [
    {
      name: 'Original',
      size: stats.originalSize,
      sizeFormatted: formatFileSize(stats.originalSize),
      color: '#EF4444'
    },
    {
      name: 'Compressed',
      size: stats.compressedSize,
      sizeFormatted: formatFileSize(stats.compressedSize),
      color: '#10B981'
    }
  ];

  const pieData = [
    { name: 'Compressed Data', value: stats.compressedSize, color: '#3B82F6' },
    { name: 'Space Saved', value: stats.spaceSaved, color: '#10B981' }
  ];

  // Performance comparison data
  const performanceData = [
    { metric: 'Compression Ratio', value: compressionPercentage, target: 20, color: '#3B82F6' },
    { metric: 'Speed (KB/s)', value: Math.min(100, (stats.originalSize / 1024 / (stats.processingTime / 1000))), target: 50, color: '#10B981' },
    { metric: 'Efficiency Score', value: Math.min(100, compressionPercentage * 2), target: 40, color: '#F59E0B' }
  ];

  // Time series simulation for processing
  const processingSteps = [
    { step: 'Start', time: 0, progress: 0 },
    { step: 'Analysis', time: stats.processingTime * 0.2, progress: 20 },
    { step: 'Encoding', time: stats.processingTime * 0.6, progress: 60 },
    { step: 'Optimization', time: stats.processingTime * 0.9, progress: 90 },
    { step: 'Complete', time: stats.processingTime, progress: 100 }
  ];

  // Radial progress data
  const radialData = [
    { name: 'Compression', value: compressionPercentage, fill: '#3B82F6' },
    { name: 'Speed', value: Math.min(100, (stats.originalSize / 1024 / (stats.processingTime / 1000)) * 2), fill: '#10B981' },
    { name: 'Efficiency', value: Math.min(100, compressionPercentage * 1.5), fill: '#F59E0B' }
  ];

  const efficiencyColor = isExcellent ? 'text-green-400' : isEffective ? 'text-blue-400' : 'text-yellow-400';
  const efficiencyBg = isExcellent ? 'bg-green-500/10 border-green-500/30' : isEffective ? 'bg-blue-500/10 border-blue-500/30' : 'bg-yellow-500/10 border-yellow-500/30';

  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-2">Compression Analysis Dashboard</h3>
        <p className="text-gray-400 text-lg">{stats.algorithm.toUpperCase()} Algorithm Performance</p>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-300 text-sm font-medium">Original Size</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{formatFileSize(stats.originalSize)}</p>
          <p className="text-blue-400 text-xs">{stats.originalSize.toLocaleString()} bytes</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 p-6 rounded-xl border border-green-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-300 text-sm font-medium">Compressed Size</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{formatFileSize(stats.compressedSize)}</p>
          <p className="text-green-400 text-xs">{stats.compressedSize.toLocaleString()} bytes</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-300 text-sm font-medium">Compression Ratio</span>
          </div>
          <p className={`text-2xl font-bold ${efficiencyColor} mb-1`}>
            {compressionPercentage}%
          </p>
          <p className="text-purple-400 text-xs">Reduction achieved</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-6 rounded-xl border border-orange-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-300 text-sm font-medium">Processing Speed</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{stats.processingTime.toFixed(1)}ms</p>
          <p className="text-orange-400 text-xs">{(stats.originalSize / 1024 / (stats.processingTime / 1000)).toFixed(0)} KB/sec</p>
        </div>
      </div>

      {/* Compression Effectiveness Alert */}
      <div className={`p-6 rounded-xl border ${efficiencyBg} backdrop-blur-sm`}>
        <div className="flex items-center gap-4">
          {isExcellent ? (
            <CheckCircle className="w-8 h-8 text-green-400" />
          ) : isEffective ? (
            <CheckCircle className="w-8 h-8 text-blue-400" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          )}
          <div className="flex-1">
            <p className={`font-semibold text-lg ${efficiencyColor}`}>
              {isExcellent 
                ? `🎉 Outstanding Performance! ${compressionPercentage}% compression achieved`
                : isEffective 
                ? `✅ Excellent Results! ${compressionPercentage}% compression (exceeds 8% target)`
                : `⚠️ Moderate Performance: ${compressionPercentage}% compression (below 8% target)`
              }
            </p>
            <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
              <div>
                <span className="text-gray-400">Space Saved:</span>
                <span className={`ml-2 font-medium ${efficiencyColor}`}>{formatFileSize(stats.spaceSaved)}</span>
              </div>
              <div>
                <span className="text-gray-400">Final Ratio:</span>
                <span className={`ml-2 font-medium ${efficiencyColor}`}>{(stats.compressionRatio * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-400">Efficiency:</span>
                <span className={`ml-2 font-medium ${efficiencyColor}`}>
                  {isExcellent ? 'Excellent' : isEffective ? 'Good' : 'Fair'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Size Comparison Bar Chart */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">Size Comparison</h4>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F9FAFB' }}
                formatter={(value: number) => [formatFileSize(value), 'Size']}
              />
              <Bar dataKey="size" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Space Distribution Pie Chart */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Space Distribution</h4>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [formatFileSize(value), 'Size']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">Compressed ({(stats.compressionRatio * 100).toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">Saved ({compressionPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Processing Timeline */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-400" />
            <h4 className="text-lg font-semibold text-white">Processing Timeline</h4>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={processingSteps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="step" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => [
                  name === 'time' ? `${value.toFixed(1)}ms` : `${value}%`,
                  name === 'time' ? 'Time' : 'Progress'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="progress" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Comparison */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h4 className="text-lg font-semibold text-white">Performance Metrics</h4>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="metric" type="category" stroke="#9CA3AF" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}`, 'Score']}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="target" fill="#374151" radius={[0, 4, 4, 0]} opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radial Performance Chart */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-5 h-5 text-cyan-400" />
            <h4 className="text-lg font-semibold text-white">Overall Performance</h4>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData}>
              <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{compressionPercentage}%</div>
              <div className="text-gray-400 text-xs">Compression</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {Math.min(100, (stats.originalSize / 1024 / (stats.processingTime / 1000)) * 2).toFixed(0)}%
              </div>
              <div className="text-gray-400 text-xs">Speed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.min(100, compressionPercentage * 1.5).toFixed(0)}%
              </div>
              <div className="text-gray-400 text-xs">Efficiency</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
        <h4 className="text-xl font-semibold text-white mb-6">Detailed Performance Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-700/30 rounded-lg">
            <div className={`text-3xl font-bold ${efficiencyColor} mb-2`}>
              {compressionPercentage}%
            </div>
            <div className="text-gray-300 font-medium mb-1">Size Reduction</div>
            <div className="text-gray-500 text-sm">
              {formatFileSize(stats.spaceSaved)} saved
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-700/30 rounded-lg">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {(stats.compressionRatio * 100).toFixed(1)}%
            </div>
            <div className="text-gray-300 font-medium mb-1">Final Size Ratio</div>
            <div className="text-gray-500 text-sm">
              of original size
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-700/30 rounded-lg">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {(stats.originalSize / 1024 / (stats.processingTime / 1000)).toFixed(0)}
            </div>
            <div className="text-gray-300 font-medium mb-1">Processing Speed</div>
            <div className="text-gray-500 text-sm">
              KB per second
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-700/30 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {((1 - stats.compressionRatio) * stats.originalSize / (stats.processingTime / 1000) / 1024).toFixed(0)}
            </div>
            <div className="text-gray-300 font-medium mb-1">Compression Rate</div>
            <div className="text-gray-500 text-sm">
              KB saved per second
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import type { CarbonIntensityData } from '../types';
import { CarbonIntensityLevel } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CarbonIntensityDisplayProps {
  intensityData: CarbonIntensityData | null;
}

const CarbonIntensityDisplay: React.FC<CarbonIntensityDisplayProps> = ({ intensityData }) => {
  if (!intensityData) {
    return (
      <div className="p-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl border border-green-dark text-center">
        <p className="text-gray-500">Loading carbon intensity data...</p>
      </div>
    );
  }

  const { currentLevel, currentValue, unit, forecastedPeriods } = intensityData;

  let bgColor = 'bg-gray-400';
  let textColor = 'text-gray-800';
  let levelText = 'Unknown';

  switch (currentLevel) {
    case CarbonIntensityLevel.LOW:
      bgColor = 'bg-green-400';
      textColor = 'text-green-800';
      levelText = 'Low';
      break;
    case CarbonIntensityLevel.MEDIUM:
      bgColor = 'bg-yellow-400';
      textColor = 'text-yellow-800';
      levelText = 'Medium';
      break;
    case CarbonIntensityLevel.HIGH:
      bgColor = 'bg-red-400';
      textColor = 'text-red-800';
      levelText = 'High';
      break;
  }

  const chartData = forecastedPeriods.slice(0, 6).map(p => ({ 
      name: new Date(p.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}), 
      intensity: p.intensityValue,
      level: p.intensity,
  }));

  const getColorForBar = (level: CarbonIntensityLevel) => {
    if (level === CarbonIntensityLevel.LOW) return '#34D399'; // emerald-400
    if (level === CarbonIntensityLevel.MEDIUM) return '#FBBF24'; // amber-400
    if (level === CarbonIntensityLevel.HIGH) return '#F87171'; // red-400
    return '#9CA3AF'; // gray-400
  }

  return (
    <div className={`p-6 ${bgColor} shadow-xl rounded-xl border-2 border-white/50`}>
      <h2 className={`text-2xl font-bold ${textColor} mb-2`}>Current Carbon Intensity</h2>
      <p className={`text-5xl font-extrabold ${textColor} mb-1`}>{levelText}</p>
      <p className={`text-lg ${textColor} opacity-90`}>{currentValue.toFixed(0)} {unit}</p>
      
      <div className="mt-6">
        <h3 className={`text-lg font-semibold ${textColor} mb-2`}>Next 12 Hours Forecast (Simulated)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
            <XAxis dataKey="name" stroke={textColor} fontSize={12} />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '0.5rem', borderColor: currentLevel === CarbonIntensityLevel.LOW ? '#34D399' : currentLevel === CarbonIntensityLevel.MEDIUM ? '#FBBF24' : '#F87171' }}
              labelStyle={{ color: '#1F2937', fontWeight: 'bold' }}
              formatter={(value: number, name: string, props: any) => [`${value} ${unit}`, `Intensity (${props.payload.level})`]}
            />
            <Bar dataKey="intensity"  radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorForBar(entry.level)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CarbonIntensityDisplay;
    
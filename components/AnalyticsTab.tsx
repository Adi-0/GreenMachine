
import React from 'react';
import { LeafIcon, ChartBarIcon } from './icons';

interface AnalyticsTabProps {
  points: number;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ points }) => {
  const demoPointHistory = [
    { day: 'Mon', points: 15 },
    { day: 'Tue', points: 25 },
    { day: 'Wed', points: 10 },
    { day: 'Thu', points: 30 },
    { day: 'Fri', points: 20 },
    { day: 'Sat', points: 45 },
    { day: 'Sun', points: 5 },
  ];
  const maxDemoPoints = Math.max(...demoPointHistory.map(d => d.points), 50);


  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <ChartBarIcon className="w-7 h-7 mr-2 text-green-600" />
          Your Green Impact
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-green-50 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Total Green Points</h3>
            <div className="flex items-center justify-center text-green-600">
              <LeafIcon className="w-10 h-10 mr-2" />
              <p className="text-5xl font-bold">{points}</p>
            </div>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Est. Energy Saved (Demo)</h3>
            <p className="text-3xl font-bold text-blue-600">{(points * 0.25).toFixed(1)} kWh</p>
            <p className="text-sm text-gray-500 mt-1">This Month</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Points History (Demo - Last 7 Days)</h3>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            {demoPointHistory.length > 0 ? (
            <div className="space-y-2">
              {demoPointHistory.map((item) => (
                <div key={item.day} className="flex items-center">
                  <span className="w-12 text-sm font-medium text-gray-600">{item.day}</span>
                  <div className="flex-grow bg-gray-200 rounded-full h-6 mr-2">
                    <div
                      className="bg-green-500 h-6 rounded-full text-xs flex items-center justify-end pr-2 text-white"
                      style={{ width: `${(item.points / maxDemoPoints) * 100}%` }}
                      title={`${item.points} points`}
                    >
                     {item.points > 0 ? item.points : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            ) : (
                 <p className="text-gray-500">No point history data available yet.</p>
            )}
          </div>
           <p className="text-xs text-gray-500 mt-2 text-center">This is a demo chart. Actual analytics will be more detailed.</p>
        </div>
      </div>

       <div className="p-6 bg-white rounded-lg shadow-lg text-center">
         <h3 className="text-xl font-semibold text-gray-700 mb-3">More Analytics Coming Soon!</h3>
         <p className="text-gray-600">We're working on bringing you detailed insights into your energy usage patterns, CO2 savings, and more.</p>
       </div>
    </div>
  );
};

export default AnalyticsTab;

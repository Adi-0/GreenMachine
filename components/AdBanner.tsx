
import React from 'react';

const AdBanner: React.FC = () => {
  return (
    <div className="mt-8 p-4 bg-gray-200 rounded-lg shadow text-center">
      <img src="https://picsum.photos/600/100?grayscale" alt="Advertisement" className="mx-auto mb-2 rounded"/>
      <p className="text-sm text-gray-700 font-semibold">Advertisement Placeholder</p>
      <p className="text-xs text-gray-500">Support Green Machine by checking out our sponsors!</p>
    </div>
  );
};

export default AdBanner;
    
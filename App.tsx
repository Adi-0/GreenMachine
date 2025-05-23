
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import { GreenMachineProvider } from './contexts/GreenMachineContext';
import { ToastContainer } from './components/Toast';

// SVG Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const CogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.93l-.15.893c-.09.543-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.019.94-1.11l.894-.148c.424-.071.764-.384.93-.781.164-.398.142-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.893z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


const App: React.FC = () => {
  return (
    <GreenMachineProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-dark via-green-DEFAULT to-green-light text-gray-dark">
        <header className="p-4 bg-green-dark shadow-lg">
          <h1 className="text-3xl font-bold text-white text-center">🌿 Green Machine Demo</h1>
        </header>

        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-2 flex justify-around items-center">
            <Link to="/" className="flex flex-col items-center text-green-dark hover:text-green-DEFAULT transition-colors">
              <HomeIcon />
              <span className="text-xs">Dashboard</span>
            </Link>
            <Link to="/settings" className="flex flex-col items-center text-green-dark hover:text-green-DEFAULT transition-colors">
              <CogIcon />
              <span className="text-xs">Settings</span>
            </Link>
          </div>
        </nav>

        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </main>

        <footer className="p-4 bg-green-dark text-white text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Green Machine Demo. Simulated interactions only.</p>
          <p>This demo does not control real hardware or use live carbon intensity APIs.</p>
        </footer>
      </div>
      <ToastContainer />
    </GreenMachineProvider>
  );
};

export default App;
    
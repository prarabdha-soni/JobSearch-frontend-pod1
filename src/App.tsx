import { Routes, Route, useNavigate } from 'react-router-dom';
import UserInterface from './UserDetailsPage';
import CompanyDetailsPage from './CompanyDetailsPage';
import UploadResumePage from './UploadResumePage';
import TalentSelectionPage from './TalentSelectionPage';
import { Briefcase, Users } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/upload-resume" element={<UploadResumePage />} />  {/* New Step */}
        <Route path="/company" element={<CompanyDetailsPage />} />
        <Route path="/talent-selection" element={<TalentSelectionPage />} />
        <Route path="/user" element={<UserInterface />} />
      </Routes>
    </div>
  );
}

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">What do you want to find?</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full">
        {/* Companies Block */}
        <div 
          onClick={() => navigate('/upload-resume')}  // ✅ Now redirects to Upload Resume
          className="cursor-pointer bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center border border-gray-300 hover:border-blue-500"
        >
          <Briefcase className="w-12 h-12 text-blue-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Companies</h2>
          <p className="text-gray-600 mt-2 text-center">Find the best talents for your business</p>
        </div>

        {/* Talents Block */}
        <div 
          onClick={() => navigate('/talent-selection')}
          className="cursor-pointer bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center border border-gray-300 hover:border-green-500"
        >
          <Users className="w-12 h-12 text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Talents</h2>
          <p className="text-gray-600 mt-2 text-center">Explore job opportunities that match your skills</p>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';

export default function TalentSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Explore Talent Options</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full">
        {/* Detailed Portal */}
        <div className="cursor-pointer bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center border border-gray-300">
          <h2 className="text-2xl font-semibold text-gray-800">Detailed Portal</h2>
          <p className="text-gray-600 mt-2 text-center">Dive deep into candidate profiles and advanced search</p>
        </div>

        {/* Continue with Talent Search */}
        <div 
          onClick={() => navigate('/user')}
          className="cursor-pointer bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center border border-gray-300 hover:border-green-500"
        >
          <h2 className="text-2xl font-semibold text-gray-800">Continue with Talent Search</h2>
          <p className="text-gray-600 mt-2 text-center">Start finding the right talent for you</p>
        </div>
      </div>
    </div>
  );
}

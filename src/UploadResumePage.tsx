import { useNavigate } from 'react-router-dom';
import { Upload, Briefcase, Search } from 'lucide-react';
import { useState, ChangeEvent } from 'react';

export default function UploadResumePage() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:5000/upload-and-rank', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        alert('File uploaded successfully and ranked!');
        navigate('/company');
      } else {
        alert('Failed to upload file. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        {/* Upload Resume Block */}
        <label className="cursor-pointer bg-white p-12 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center border border-gray-300 hover:border-blue-500 text-center">
          <Upload className={`w-12 h-12 ${isUploading ? 'text-gray-400 animate-spin' : 'text-blue-500'} mb-4`} />
          <h2 className="text-2xl font-semibold text-gray-800">Upload Resume and We Will Do the Rest</h2>
          <p className="text-gray-600 mt-2">{isUploading ? 'Uploading...' : 'Click to upload and proceed'}</p>
          <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>

        {/* Detailed User Portal Block */}
        <div 
          onClick={() => navigate('/detailed-user-portal')} 
          className="cursor-pointer bg-white p-12 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center border border-gray-300 hover:border-green-500 text-center"
        >
          <Briefcase className="w-12 h-12 text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Detailed User Portal</h2>
          <p className="text-gray-600 mt-2">Explore advanced user profiles and insights</p>
        </div>

        {/* Search Jobs Block */}
        <div 
          onClick={() => navigate('/company')} 
          className="cursor-pointer bg-white p-12 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center border border-gray-300 hover:border-yellow-500 text-center"
        >
          <Search className="w-12 h-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Search Jobs</h2>
          <p className="text-gray-600 mt-2">Find job opportunities that match your skills</p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import companyLogo from './images/company-logo.png'; // Adjust the path as necessary

interface Job {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  details: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    district: string;
    state: string;
    pincode: number;
  };
}

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 relative">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{job.name}</h2>
          <p className="text-gray-600">{job.mobile}</p>
          <p className="text-gray-600">{job.details.city}, {job.details.state}</p>
          <p className="text-gray-600">{job.details.address_line_1}, {job.details.address_line_2}</p>
          <p className="text-gray-600">Pincode: {job.details.pincode}</p>
        </div>
        <div className="flex flex-col items-end">
          <img src={companyLogo} alt="Company Logo" className="w-12 h-12 mb-2" />
          <span className="text-gray-500">Posted: 12 days ago</span>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Register to apply</button>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Login to apply</button>
      </div>
    </div>
  );
};

export default JobCard;
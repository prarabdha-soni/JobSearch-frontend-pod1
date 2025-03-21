import React from 'react';

interface UserCardProps {
  name: string;
  location: string;
  role: string;
  employmentType: string;
  ranking: number;
  image: string;
}

const UserCard: React.FC<UserCardProps> = ({ name, location, role, employmentType, ranking, image }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 relative">
      {/* View Profile Button at Top Left */}
      <button className="absolute top-2 left-2 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
        View profile →
      </button>

      {/* User Image */}
      <div className="mt-6 w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>

      {/* User Details */}
      <div className="flex-1 mt-6">
        <div className="flex justify-between items-center mb-2"></div>
        <p className="text-xs text-gray-500 font-medium uppercase">{role}</p>
        <p className="text-sm font-semibold">{name}</p>

        <p className="text-sm text-gray-500">
          Remote • {location} • {employmentType}
        </p>
      </div>
    </div>
  );
};

export default UserCard;

import React from 'react';
import { Link } from 'react-router-dom';

const SidebarHeader = () => {
  return (
    <div className="flex h-full items-center">
      <Link to="/" className="text-gray-800 text-lg font-semibold">
        Reg Navigator
      </Link>
    </div>
  );
};

export default SidebarHeader;
  
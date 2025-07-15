import React, { useState } from 'react';

// Loading组件
const Loading = ({ visible = false, text = '加载中...' }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4 min-w-[200px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-700 text-sm font-medium">{text}</p>
      </div>
    </div>
  );
};
export default Loading;

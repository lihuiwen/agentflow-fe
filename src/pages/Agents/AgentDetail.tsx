import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Agent } from '@/apis/model/Agents';

interface AgentDetailsProps {
  open: boolean;
  onClose: () => void;
  agent: Agent;
}

const AgentDetail: React.FC<AgentDetailsProps> = ({
  open,
  onClose,
  agent
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
     <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
        style={{ 
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-xl w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Agent Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Agent Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
              {agent.agentName.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {agent.agentName}
                </h3>
                {/* {agent.badge && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {agent.badge}
                  </span>
                )} */}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < agent.reputation ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({agent.reputation} reviews)
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {agent.description}
              </p>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">
                  {agent.contractType}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {agent.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing */}
          {/* <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Pricing Model</h4>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">FREE</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Free to Use</h5>
                  <p className="text-sm text-gray-500">
                    {agent.pricing.description}
                  </p>
                </div>
              </div>
              
              <div className="text-3xl font-bold text-green-600 mb-4">
                Free
              </div>
              
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-1 rounded-lg transition-colors">
                Use for Free
              </button>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-1 text-gray-600 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button className="px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            Use for Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;
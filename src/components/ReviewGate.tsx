import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { Document } from '../types';

interface ReviewGateProps {
  document: Document;
  onApprove: () => void;
  onReject: () => void;
}

const ReviewGate: React.FC<ReviewGateProps> = ({ document, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
      <div className="flex items-center mb-4">
        <AlertCircle className="w-6 h-6 text-yellow-500 mr-2" />
        <h3 className="text-lg font-semibold">Human Review Required</h3>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">{document.title}</h4>
        <p className="text-gray-600 text-sm mb-2">
          This document requires human review before proceeding.
        </p>
        <div className="text-sm text-gray-500">
          Reviewers: {document.reviewers.join(', ')}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onApprove}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Check className="w-4 h-4 mr-2" />
          Approve
        </button>
        <button
          onClick={onReject}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4 mr-2" />
          Reject
        </button>
      </div>
    </div>
  );
};

export default ReviewGate;
import React, { useState } from 'react';
import { Document } from '../types';
import { FileEdit, Check, Clock, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import ReviewGate from './ReviewGate';

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const [showReview, setShowReview] = useState(false);
  
  const statusIcons = {
    draft: <FileEdit className="w-5 h-5 text-yellow-500" />,
    review: <Clock className="w-5 h-5 text-blue-500" />,
    approved: <Check className="w-5 h-5 text-green-500" />
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
        {statusIcons[document.status]}
      </div>
      <div className="text-sm text-gray-500">
        Last modified: {format(document.lastModified, 'MMM d, yyyy HH:mm')}
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <a
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          View Document
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        
        {document.status === 'review' && (
          <button
            onClick={() => setShowReview(!showReview)}
            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Review
          </button>
        )}
      </div>

      {showReview && document.status === 'review' && (
        <div className="mt-4">
          <ReviewGate
            document={document}
            onApprove={() => {
              console.log('Document approved');
              setShowReview(false);
            }}
            onReject={() => {
              console.log('Document rejected');
              setShowReview(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

export const EmailConfirmation: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        const { user, error } = await authService.handleEmailConfirmation();
        
        if (error) {
          throw error;
        }

        if (user) {
          toast.success('Email confirmed successfully!');
          navigate('/dashboard');
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to confirm email');
        navigate('/login');
      }
    };

    handleConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Confirming your email...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we verify your email address.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation; 
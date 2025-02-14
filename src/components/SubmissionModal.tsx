import React from 'react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  sandwichesOnBoard: any[]; // Adjust the type as needed
  isSubmitting: boolean;
  submissionSuccess: boolean;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  sandwichesOnBoard,
  isSubmitting,
  submissionSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Submit Board</h2>
        <p className="mb-4">You have {sandwichesOnBoard.length} sandwiches on the board.</p>
        
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : submissionSuccess ? (
          <p className="text-green-500">Submission successful!</p>
        ) : (
          <div className="flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button onClick={onSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionModal;

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
      <div className="bg-gray-800 p-6 rounded-lg w-[500px]">
        <h2 className="text-xl text-gray-200 mb-4">Submit Board</h2>
        <p className="text-gray-300 mb-6">
          You have {sandwichesOnBoard.length} sandwiches on the board.
        </p>

        {isSubmitting ? (
          <div className="flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : submissionSuccess ? (
          <p className="text-green-500 mb-6">Submission successful!</p>
        ) : (
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 cursor-pointer"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionModal;

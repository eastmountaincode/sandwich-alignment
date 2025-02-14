interface ClearBoardModalProps {
    onClose: () => void
    onConfirm: () => void
  }
  
  function ClearBoardModal({ onClose, onConfirm }: ClearBoardModalProps) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl text-gray-200 mb-4">Clear Board?</h2>
          <p className="text-gray-300 mb-6">This will remove all sandwiches from the board.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 cursor-pointer"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default ClearBoardModal
  
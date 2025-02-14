import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { removeSandwich } from '../store/boardSlice'
import { setSelectedSandwich } from '../store/selectedSandwichSlice'

function SandwichInspector() {
  const dispatch = useDispatch()
  const selectedSandwich = useSelector((state: RootState) => state.selectedSandwich.selectedSandwich)
  const labels = useSelector((state: RootState) => state.board.axisLabels)
  const sandwichesOnBoard = useSelector((state: RootState) => state.board.sandwichesOnBoard)

  const handleRemove = () => {
    if (selectedSandwich) {
      dispatch(removeSandwich(selectedSandwich.id))
      dispatch(setSelectedSandwich(null))
    }
  }

  const getXPercentage = (x: number) => {
    if (x >= 0) {
      return `${Math.round(x * 100)}% ${labels.right}`
    } else {
      return `${Math.round(-x * 100)}% ${labels.left}`
    }
  }
  
  const getYPercentage = (y: number) => {
    if (y <= 0) {
      return `${Math.round(-y * 100)}% ${labels.top}`
    } else {
      return `${Math.round(y * 100)}% ${labels.bottom}`
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (!selectedSandwich) return;

    // Check if the sandwich is already on the board
    const isOnBoard = sandwichesOnBoard.some(s => s.id === selectedSandwich.id);
    if (isOnBoard) {
      e.preventDefault(); // Prevent dragging if it's already on the board
      return;
    }

    e.dataTransfer.setData('application/json', JSON.stringify(selectedSandwich));

    // Clone the image element
    const imgElement = e.currentTarget as HTMLImageElement;
    const ghostImg = imgElement.cloneNode(true) as HTMLImageElement;

    // Scale the cloned image
    const scaleFactor = 0.6; // Adjust this factor to make the image smaller
    ghostImg.style.width = `${imgElement.width * scaleFactor}px`;
    ghostImg.style.height = `${imgElement.height * scaleFactor}px`;

    ghostImg.style.position = 'absolute';
    ghostImg.style.top = '-1500px'; // Move it off-screen
    ghostImg.style.left = '-1500px'; // Move it off-screen
    ghostImg.style.pointerEvents = 'none'; // Ensure it doesn't interfere with other elements
    ghostImg.style.opacity = '0.5';

    document.body.appendChild(ghostImg);

    // Use the ghost image as the drag image
    e.dataTransfer.setDragImage(ghostImg, ghostImg.offsetWidth / 2, ghostImg.offsetHeight / 2);

    // Cleanup after drag ends
    const onDragEnd = () => {
      if (ghostImg && document.body.contains(ghostImg)) {
        document.body.removeChild(ghostImg);
      }
      if (e.currentTarget) {
        e.currentTarget.removeEventListener('dragend', onDragEnd);
      }
    };

    e.currentTarget.addEventListener('dragend', onDragEnd);
  };
  

  return (
    <div className="p-6 text-gray-200 select-none">
      <h2 className="text-2xl font-bold mb-6 text-center tracking-tight">Sandwich Inspector</h2>
      
      {!selectedSandwich ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
          No sandwich selected
          <span className="text-sm mt-2">(Click on a sandwich to select)</span>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img 
            src={selectedSandwich.imagePath} 
            alt={selectedSandwich.name}
            className={`max-w-[90%] h-48 object-contain rounded-lg mb-4 ${!sandwichesOnBoard.some(s => s.id === selectedSandwich.id) ? 'cursor-grab' : ''}`}
            draggable={!sandwichesOnBoard.some(s => s.id === selectedSandwich.id)} // Disable dragging if on board
            onDragStart={handleDragStart}
          />
          
          <div className="w-full mt-4">
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Name:</p>
              <p className="text-lg">{selectedSandwich.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">X-Axis:</p>
                <p className={selectedSandwich.x !== undefined ? "" : "text-gray-500"}>
                  {selectedSandwich.x !== undefined ? getXPercentage(selectedSandwich.x) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Y-Axis:</p>
                <p className={selectedSandwich.y !== undefined ? "" : "text-gray-500"}>
                  {selectedSandwich.y !== undefined ? getYPercentage(selectedSandwich.y) : "N/A"}
                </p>
              </div>
            </div>
          </div>
          
          {selectedSandwich && sandwichesOnBoard.some(s => s.id === selectedSandwich.id) && (
            <button 
              onClick={handleRemove}
              className="mt-6 px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 cursor-pointer"
            >
              Remove from Board
            </button>
          )}
        </div>
      )}
    </div>
  )}
export default SandwichInspector
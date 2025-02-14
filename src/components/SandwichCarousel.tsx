import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import sandwichData from '../data/sandwiches.json'
import { setSelectedSandwich } from '../store/selectedSandwichSlice'
import { useRef } from 'react'

function SandwichCarousel() {
  const dispatch = useDispatch()
  const carouselRef = useRef<HTMLDivElement>(null)
  const sandwichesOnBoard = useSelector((state: RootState) => state.board.sandwichesOnBoard)
  const selectedSandwich = useSelector((state: RootState) => state.selectedSandwich.selectedSandwich)

  const availableSandwiches = sandwichData.sandwiches.filter(
    sandwich => !sandwichesOnBoard.some(placed => placed.id === sandwich.id)
  )

  const handleSandwichClick = (e: React.MouseEvent, sandwich: typeof sandwichData.sandwiches[0]) => {
    e.stopPropagation()
    dispatch(setSelectedSandwich(sandwich))
  }

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 200
      const newScrollLeft = carouselRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const handleDragStart = (e: React.DragEvent, sandwich: typeof sandwichData.sandwiches[0]) => {
    e.dataTransfer.setData('application/json', JSON.stringify(sandwich));

    // Find the image element within the current target
    const imgElement = e.currentTarget.querySelector('img') as HTMLImageElement;
    if (!imgElement) return;

    // Clone the image element
    const ghostImg = imgElement.cloneNode(true) as HTMLImageElement;

    // Scale the cloned image
    const scaleFactor = 1.8; // Adjust this factor to make the image slightly larger
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
    <div className="w-full h-full rounded-lg flex items-center select-none">
      <button
        onClick={() => scroll('left')}
        className="px-4 py-2 bg-gray-700 text-gray-200 rounded-l hover:bg-gray-600 h-full"
      >
        ←
      </button>

      <div
        ref={carouselRef}
        className="flex gap-2 overflow-x-auto overflow-y-hidden hide-scrollbar h-full p-2 px-4 flex-1"
      >
        {availableSandwiches.map(sandwich => (
          <div
            key={sandwich.id}
            onClick={(e) => handleSandwichClick(e, sandwich)}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, sandwich)}
            className={`flex flex-col flex-shrink-0 cursor-grab transition-transform h-full justify-center origin-top p-4
            ${selectedSandwich?.id === sandwich.id ? 'ring-1 ring-white-500 rounded-lg' : ''}`}
          >
            <img
              src={sandwich.imagePath}
              alt={sandwich.name}
              draggable={false}
              className="w-24 h-12"
            />
            <p
              className="text-gray-200 text-xs mt-1 text-center w-24 select-none"
              draggable={false}
            >
              {sandwich.name}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="px-4 py-2 bg-gray-700 text-gray-200 rounded-r hover:bg-gray-600 h-full"
      >
        →
      </button>
    </div>
  )
}

export default SandwichCarousel


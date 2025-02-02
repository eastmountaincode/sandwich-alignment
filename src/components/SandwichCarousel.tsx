import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import sandwichData from '../data/sandwiches.json'

function SandwichCarousel() {
  const sandwichesOnBoard = useSelector((state: RootState) => state.board.sandwichesOnBoard)

  const availableSandwiches = sandwichData.sandwiches.filter(
    sandwich => !sandwichesOnBoard.some(placed => placed.id === sandwich.id)
  )

  return (
    <div className="w-full h-full rounded-lg px-2">
      <div className="flex gap-8 overflow-x-auto overflow-y-hidden hide-scrollbar h-full">
        {availableSandwiches.map(sandwich => (
          <div 
            key={sandwich.id}
            className="flex flex-col flex-shrink-0 cursor-pointer hover:scale-105 transition-transform h-full justify-center"
          >
            <img 
              src={sandwich.imagePath} 
              alt={sandwich.name}
              className="w-24 h-14 object-cover rounded-lg"
            />
            <p className="text-gray-200 text-xs mt-1 text-center w-24">
              {sandwich.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SandwichCarousel


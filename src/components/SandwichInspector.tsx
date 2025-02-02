import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

function SandwichInspector() {
  const selectedSandwich = useSelector((state: RootState) => state.selectedSandwich.selectedSandwich)

  return (
    <div className="p-6 text-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center tracking-tight">Sandwich Inspector</h2>
      
      {!selectedSandwich ? (
        <div className="flex items-center justify-center h-[300px] text-gray-400">
          No sandwich selected
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img 
            src={selectedSandwich.imagePath} 
            alt={selectedSandwich.name}
            className="max-w-[90%] h-48 object-contain rounded-lg mb-4"
          />
          
          <div className="w-full mt-4">
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Name:</p>
              <p className="text-lg">{selectedSandwich.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Position X:</p>
                <p className={selectedSandwich.x !== undefined ? "" : "text-gray-500"}>
                  {selectedSandwich.x !== undefined ? selectedSandwich.x.toFixed(2) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Position Y:</p>
                <p className={selectedSandwich.y !== undefined ? "" : "text-gray-500"}>
                  {selectedSandwich.y !== undefined ? selectedSandwich.y.toFixed(2) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SandwichInspector

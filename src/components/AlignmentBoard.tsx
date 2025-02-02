import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../store/store"
import { addSandwich } from "../store/boardSlice"

function AlignmentBoard() {
  const dispatch = useDispatch()
  const labels = useSelector((state: RootState) => state.board.axisLabels)
  const sandwichesOnBoard = useSelector((state: RootState) => state.board.sandwichesOnBoard)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const sandwich = JSON.parse(e.dataTransfer.getData('application/json'))

    const board = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - board.left) / board.width) * 2 - 1
    const y = ((e.clientY - board.top) / board.height) * 2 - 1

    dispatch(addSandwich({ ...sandwich, x, y }))
  }

  return (
    <div
      className="relative w-full h-full bg-gray-200 rounded-lg"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Lines */}
        <line x1="250" y1="20" x2="250" y2="480" stroke="#1f2937" strokeWidth="2" />
        <line x1="-70" y1="250" x2="570" y2="250" stroke="#1f2937" strokeWidth="2" />

        {/* Arrows */}
        <path d="M250 15 L240 35 L260 35 Z" fill="#1f2937" />
<path d="M250 485 L240 465 L260 465 Z" fill="#1f2937" />
<path d="M-80 250 L-60 240 L-60 260 Z" fill="#1f2937" />
<path d="M580 250 L560 240 L560 260 Z" fill="#1f2937" />
      </svg>

      {/* Sandwiches */}
      {sandwichesOnBoard.map(sandwich => (
        <img
          key={sandwich.id}
          src={sandwich.imagePath}
          alt={sandwich.name}
          className="absolute w-16 h-16 object-cover -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${((sandwich.x! + 1) / 2) * 100}%`,
            top: `${((sandwich.y! + 1) / 2) * 100}%`,
          }}
        />
      ))}

      {/* Labels as HTML elements instead of SVG text */}
      <div className="text-gray-800 select-none">
        <div className="absolute top-13 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-100 border border-gray-400 rounded text-sm">{labels.top}</div>
        <div className="absolute bottom-13 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-100 border border-gray-400 rounded text-sm">{labels.bottom}</div>
        <div className="absolute left-13 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-100 border border-gray-400 rounded text-sm">{labels.left}</div>
        <div className="absolute right-13 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-100 border border-gray-400 rounded text-sm">{labels.right}</div>
      </div>
    </div>
  )
}

export default AlignmentBoard

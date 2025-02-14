import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAxisLabels } from '../store/boardSlice'
import type { RootState } from '../store/store'

interface AxisLabelModalProps {
  onClose: () => void
}

const defaultLabels = {
  top: 'Good',
  bottom: 'Evil',
  left: 'Lawful',
  right: 'Chaotic'
}

function AxisLabelModal({ onClose }: AxisLabelModalProps) {
  const dispatch = useDispatch()
  const currentLabels = useSelector((state: RootState) => state.board.axisLabels)
  const [labels, setLabels] = useState(currentLabels)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setAxisLabels(labels))
    onClose()
  }

  const handleReset = () => {
    setLabels(defaultLabels)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-[500px]">
        <h2 className="text-2xl text-gray-200 mb-6">Set Axis Labels</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex justify-center">
            <input
              type="text"
              value={labels.top}
              onChange={e => setLabels({...labels, top: e.target.value})}
              className="w-48 p-2 rounded text-center border border-gray-600 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-between">
            <input
              type="text"
              value={labels.left}
              onChange={e => setLabels({...labels, left: e.target.value})}
              className="w-48 p-2 rounded text-center border border-gray-600 focus:border-blue-500 outline-none"
            />
            <input
              type="text"
              value={labels.right}
              onChange={e => setLabels({...labels, right: e.target.value})}
              className="w-48 p-2 rounded text-center border border-gray-600 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-center">
            <input
              type="text"
              value={labels.bottom}
              onChange={e => setLabels({...labels, bottom: e.target.value})}
              className="w-48 p-2 rounded text-center border border-gray-600 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-4 justify-between mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 cursor-pointer"
            >
              Reset to Default
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AxisLabelModal

import { useState } from 'react'
import AxisLabelModal from './AxisLabelModal'

function ControlPanel() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="flex justify-between items-center w-full rounded-lg mx-4">
            <div className="text-gray-200 ms-4">
                Sandwiches placed: - / -
            </div>

            <div className="flex gap-4">
                <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600">
                    Clear All
                </button>
                <button
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
                    onClick={() => setIsModalOpen(true)}
                >
                    Set Axis Labels
                </button>
            </div>

            {isModalOpen && (
                <AxisLabelModal
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
}

export default ControlPanel

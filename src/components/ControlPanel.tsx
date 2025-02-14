import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearBoard } from '../store/boardSlice'
import { setSelectedSandwich } from '../store/selectedSandwichSlice'
import AxisLabelModal from './AxisLabelModal'
import { RootState } from '../store/store'
import sandwichData from '../data/sandwiches.json'
import ClearBoardModal from './ClearBoardModal'
import Celebration from './Celebration'


function ControlPanel() {
    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isClearModalOpen, setIsClearModalOpen] = useState(false)
    const sandwichesOnBoard = useSelector((state: RootState) => state.board.sandwichesOnBoard)

    const handleClearConfirm = () => {
        dispatch(clearBoard())
        dispatch(setSelectedSandwich(null))
        setIsClearModalOpen(false)
    }

    const handleSubmitBoard = async () => {
        console.log('Submitting board state:', sandwichesOnBoard);
    
        try {
            const response = await fetch('/api/submitBoard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sandwichesOnBoard }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit board');
            }
    
            const data = await response.json();
            console.log('Board submitted:', data);
        } catch (error) {
            console.error('Error submitting board:', error);
        }
    };

    return (
        <div className="flex justify-between items-center w-full rounded-lg mx-4">
            <div className="text-gray-200 ms-4">
                Sandwiches placed: {sandwichesOnBoard.length} / {sandwichData.sandwiches.length}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setIsClearModalOpen(true)}
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 cursor-pointer"
                >
                    Clear Board
                </button>
                <button
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    Set Axis Labels
                </button>
                <button
                    onClick={handleSubmitBoard}
                    className="px-4 py-2 bg-purple-500 text-gray-200 rounded hover:bg-purple-400 cursor-pointer"
                >
                    Submit Board
                </button>
            </div>

            {isModalOpen && (
                <AxisLabelModal
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {isClearModalOpen && (
                <ClearBoardModal
                    onClose={() => setIsClearModalOpen(false)}
                    onConfirm={handleClearConfirm}
                />
            )}

            {sandwichesOnBoard.length === sandwichData.sandwiches.length && <Celebration />}


        </div>
    )
}

export default ControlPanel
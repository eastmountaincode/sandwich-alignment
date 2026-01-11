import { useState } from 'react';
import GeneratedBoardData from './GeneratedBoardData';

interface SubmittedBoard {
    _id: string;
    sandwichesOnBoard: Array<{ id: string; name: string; x: number; y: number }>;
    axisLabels: { top: string; bottom: string; left: string; right: string };
    createdAt: string;
}

function AdminAuthenticated() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [clearSuccess, setClearSuccess] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [submittedBoards, setSubmittedBoards] = useState<SubmittedBoard[]>([]);
    const [isFetchingBoards, setIsFetchingBoards] = useState(false);

    const handleFetchBoards = async () => {
        setIsFetchingBoards(true);
        try {
            const response = await fetch('/api/getSubmittedBoards');
            const data = await response.json();
            console.log('Fetched boards:', data);
            setSubmittedBoards(data.boards || []);
        } catch (error) {
            console.error('Error fetching boards:', error);
        } finally {
            setIsFetchingBoards(false);
        }
    };

    const handleGenerateBoard = async () => {
        setIsGenerating(true);
        setSubmissionSuccess(false);

        try {
            const response = await fetch('/api/generateBoard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            console.log('Generated data:', data);
            setGeneratedData(data);
        } catch (error) {
            console.error('Error generating board:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmitBoard = async () => {
        if (!generatedData) return;
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/submitBoard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(generatedData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit board');
            }

            // const data = await response.json();
            // console.log('Board submitted:', data);
            setSubmissionSuccess(true);
        } catch (error) {
            console.error('Error submitting board:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClearCollection = async () => {
        setIsClearing(true);
        try {
            const response = await fetch('/api/clearCollection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to clear collection');
            }

            // const data = await response.json();
            // console.log('Collection cleared:', data);
            setClearSuccess(true);
        } catch (error) {
            console.error('Error clearing collection:', error);
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-neutral-200 p-8">
            <h1 className="text-2xl mb-6">Admin Dashboard</h1>
            <div className="bg-neutral-900 rounded-lg p-6 mb-4 border border-neutral-700">
                <h2 className="text-xl mb-4">Database Management</h2>
                <div className='flex mb-6'>
                    <button
                        onClick={handleClearCollection}
                        className="px-4 py-2 bg-neutral-800 text-neutral-200 rounded hover:bg-neutral-700 transition-colors border border-neutral-600"
                        disabled={isClearing}
                    >
                        {isClearing ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : clearSuccess ? (
                            'Collection Cleared'
                        ) : (
                            'Clear Collection'
                        )}
                    </button>
                </div>
                <h2 className="text-xl mb-4">Board Generation</h2>
                <div className="flex gap-4">

                    <button
                        onClick={handleGenerateBoard}
                        className="px-4 py-2 bg-neutral-800 text-neutral-200 rounded hover:bg-neutral-700 transition-colors"
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            'Generate Board'
                        )}
                    </button>
                    <button
                        onClick={handleSubmitBoard}
                        className="px-4 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting || !generatedData || submissionSuccess}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                            </div>
                        ) : submissionSuccess ? (
                            'Board Submitted'
                        ) : (
                            'Submit Generated Board'
                        )}
                    </button>
                </div>
            </div>
            {generatedData && <GeneratedBoardData generatedData={generatedData} />}

            <div className="bg-neutral-900 rounded-lg p-6 mt-4 border border-neutral-700">
                <h2 className="text-xl mb-4">User Submitted Boards (5+ sandwiches)</h2>
                <button
                    onClick={handleFetchBoards}
                    className="px-4 py-2 bg-neutral-800 text-neutral-200 rounded hover:bg-neutral-700 transition-colors border border-neutral-600 mb-4"
                    disabled={isFetchingBoards}
                >
                    {isFetchingBoards ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        </div>
                    ) : (
                        'Fetch Boards'
                    )}
                </button>

                {submittedBoards.length > 0 && (
                    <div className="mt-4">
                        <p className="text-neutral-400 mb-2">Found {submittedBoards.length} boards</p>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {submittedBoards.map((board) => (
                                <div key={board._id} className="bg-neutral-800 p-3 rounded border border-neutral-600">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm text-neutral-400">ID: {board._id}</p>
                                            <p className="text-sm">Sandwiches: {board.sandwichesOnBoard.length}</p>
                                            <p className="text-sm text-neutral-400">
                                                Labels: {board.axisLabels.top} / {board.axisLabels.bottom} / {board.axisLabels.left} / {board.axisLabels.right}
                                            </p>
                                        </div>
                                        <p className="text-xs text-neutral-500">
                                            {new Date(board.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminAuthenticated;

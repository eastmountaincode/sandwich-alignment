import { useState } from 'react';
import GeneratedBoardData from './GeneratedBoardData';

function AdminAuthenticated() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const handleGenerateBoard = async () => {
        setIsGenerating(true);
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

            const data = await response.json();
            console.log('Board submitted:', data);
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

            const data = await response.json();
            console.log('Collection cleared:', data);
        } catch (error) {
            console.error('Error clearing collection:', error);
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
            <h1 className="text-2xl mb-6">Admin Dashboard</h1>
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl mb-4">Database Management</h2>
                <div className='flex'>
                    <button
                        onClick={handleClearCollection}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                        disabled={isClearing}
                    >
                        {isClearing ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            'Clear Collection'
                        )}
                    </button>
                </div>
                <h2 className="text-xl mb-4">Board Generation</h2>
                <div className="flex gap-4">

                    <button
                        onClick={handleGenerateBoard}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
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
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting || !generatedData || submissionSuccess}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
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

        </div>
    );
}

export default AdminAuthenticated;

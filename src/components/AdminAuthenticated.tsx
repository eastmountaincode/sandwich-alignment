import { useState } from 'react';

function AdminAuthenticated() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null);

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
            setGeneratedData(data);
        } catch (error) {
            console.error('Error generating board:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
            <h1 className="text-2xl mb-6">Admin Dashboard</h1>
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl mb-4">Board Generation</h2>
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
            </div>

            {generatedData && (
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl mb-4">Generated Board Data</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg mb-2">Message</h3>
                            <div>{generatedData.message}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminAuthenticated;

import { useState } from 'react';

interface GeneratedSandwich {
    id: string;
    x: number;
    y: number;
}

function AdminAuthenticated() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        } catch (error) {
            console.error('Error submitting board:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
            <h1 className="text-2xl mb-6">Admin Dashboard</h1>
            <div className="bg-gray-800 rounded-lg p-6">
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
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-400 transition-colors"
                        disabled={isSubmitting || !generatedData}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            'Submit Generated Board'
                        )}
                    </button>
                </div>
            </div>

            {generatedData && (
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl mb-4">Generated Board Data</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg mb-2">Axis Labels</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(generatedData.axisLabels as Record<string, string>).map(([key, value]) => (
                                    <div key={key} className="bg-gray-700 p-2 rounded">
                                        {key}: {value}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg mb-2">Sandwiches</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {generatedData.sandwichesOnBoard.map((sandwich: GeneratedSandwich) => (
                                    <div key={sandwich.id} className="bg-gray-700 p-2 rounded">
                                        {sandwich.id}: ({sandwich.x.toFixed(2)}, {sandwich.y.toFixed(2)})
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg mb-2">Note</h3>
                            <div className="bg-gray-700 p-2 rounded">{generatedData.note}</div>
                        </div>
                        <div>
                            <h3 className="text-lg mb-2">Source</h3>
                            <div className="bg-gray-700 p-2 rounded">{generatedData.source}</div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminAuthenticated;

interface GeneratedSandwich {
    id: string;
    x: number;
    y: number;
}

interface GeneratedBoardDataProps {
    generatedData: {
        axisLabels: Record<string, string>;
        sandwichesOnBoard: GeneratedSandwich[];
        note: string;
        source: string;
    };
}

function GeneratedBoardData({ generatedData }: GeneratedBoardDataProps) {
    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl mb-4">Generated Board Data</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg mb-2">Axis Labels</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(generatedData.axisLabels).map(([key, value]) => (
                            <div key={key} className="bg-gray-700 p-2 rounded">
                                {key}: {value}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg mb-2">Sandwiches</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {generatedData.sandwichesOnBoard.map((sandwich) => (
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
    );
}

export default GeneratedBoardData;

import { useState, useMemo } from 'react';
import GeneratedBoardData from './GeneratedBoardData';

interface SandwichPosition {
    id: string;
    name: string;
    imagePath: string;
    x: number;
    y: number;
}

interface SubmittedBoard {
    _id: string;
    sandwichesOnBoard: SandwichPosition[];
    axisLabels: { top: string; bottom: string; left: string; right: string };
    note: string;
    createdAt: string;
}

interface ConsensusSandwich {
    id: string;
    name: string;
    imagePath: string;
    avgX: number;
    avgY: number;
    count: number;
}

function AdminAuthenticated() {
    const [activeTab, setActiveTab] = useState<'management' | 'submissions'>('management');
    const [selectedConsensusSandwich, setSelectedConsensusSandwich] = useState<ConsensusSandwich | null>(null);
    const [distanceThreshold, setDistanceThreshold] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [clearSuccess, setClearSuccess] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [submittedBoards, setSubmittedBoards] = useState<SubmittedBoard[]>([]);
    const [isFetchingBoards, setIsFetchingBoards] = useState(false);

    // Calculate consensus positions for all sandwiches
    const consensusSandwiches = useMemo(() => {
        if (submittedBoards.length === 0) return [];

        const sandwichMap = new Map<string, {
            name: string;
            imagePath: string;
            totalX: number;
            totalY: number;
            count: number
        }>();

        // Aggregate all sandwich positions
        for (const board of submittedBoards) {
            for (const sandwich of board.sandwichesOnBoard) {
                const existing = sandwichMap.get(sandwich.id);
                if (existing) {
                    existing.totalX += sandwich.x;
                    existing.totalY += sandwich.y;
                    existing.count += 1;
                } else {
                    sandwichMap.set(sandwich.id, {
                        name: sandwich.name,
                        imagePath: sandwich.imagePath,
                        totalX: sandwich.x,
                        totalY: sandwich.y,
                        count: 1
                    });
                }
            }
        }

        // Calculate averages
        const result: ConsensusSandwich[] = [];
        sandwichMap.forEach((data, id) => {
            result.push({
                id,
                name: data.name,
                imagePath: data.imagePath,
                avgX: data.totalX / data.count,
                avgY: data.totalY / data.count,
                count: data.count
            });
        });

        // Sort by count (most common first)
        return result.sort((a, b) => b.count - a.count);
    }, [submittedBoards]);

    // Filter sandwiches by distance from origin (using max of |x| or |y|)
    const filteredConsensusSandwiches = useMemo(() => {
        if (distanceThreshold === 0) return consensusSandwiches;
        return consensusSandwiches.filter(sandwich => {
            const distance = Math.max(Math.abs(sandwich.avgX), Math.abs(sandwich.avgY));
            return distance >= distanceThreshold;
        });
    }, [consensusSandwiches, distanceThreshold]);

    // Find extreme sandwiches
    const extremeSandwiches = useMemo(() => {
        if (consensusSandwiches.length === 0) return null;
        return {
            mostChaotic: consensusSandwiches.reduce((max, s) => s.avgX > max.avgX ? s : max),
            mostLawful: consensusSandwiches.reduce((min, s) => s.avgX < min.avgX ? s : min),
            mostGood: consensusSandwiches.reduce((min, s) => s.avgY < min.avgY ? s : min),
            mostEvil: consensusSandwiches.reduce((max, s) => s.avgY > max.avgY ? s : max),
        };
    }, [consensusSandwiches]);

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

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('management')}
                    className={`px-4 py-2 rounded transition-colors ${
                        activeTab === 'management'
                            ? 'bg-white text-black'
                            : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                    }`}
                >
                    Database Management
                </button>
                <button
                    onClick={() => setActiveTab('submissions')}
                    className={`px-4 py-2 rounded transition-colors ${
                        activeTab === 'submissions'
                            ? 'bg-white text-black'
                            : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                    }`}
                >
                    User Submissions
                </button>
            </div>

            {/* Database Management Tab */}
            {activeTab === 'management' && (
                <>
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
                </>
            )}

            {/* User Submissions Tab */}
            {activeTab === 'submissions' && (
                <div className="space-y-6">
                    <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-700">
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
                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {submittedBoards.map((board) => (
                                        <div key={board._id} className="bg-neutral-800 p-3 rounded border border-neutral-600">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm text-neutral-400">ID: {board._id}</p>
                                                    <p className="text-sm">Sandwiches: {board.sandwichesOnBoard.length}</p>
                                                    <p className="text-sm text-neutral-400">
                                                        Labels: {board.axisLabels.top} / {board.axisLabels.bottom} / {board.axisLabels.left} / {board.axisLabels.right}
                                                    </p>
                                                    {board.note && <p className="text-sm text-yellow-400 mt-1">Note: {board.note}</p>}
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

                    {/* Consensus Board */}
                    {consensusSandwiches.length > 0 && (
                        <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-700">
                            <h2 className="text-xl mb-4">Consensus Board ({filteredConsensusSandwiches.length} / {consensusSandwiches.length} sandwiches)</h2>
                            <p className="text-neutral-400 text-sm mb-4">
                                Sandwiches placed at their average position across {submittedBoards.length} submissions
                            </p>

                            {/* Distance Filter Slider */}
                            <div className="mb-4 flex items-center gap-4">
                                <label className="text-sm text-neutral-400 whitespace-nowrap">
                                    Min distance from center:
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={distanceThreshold}
                                    onChange={(e) => setDistanceThreshold(parseFloat(e.target.value))}
                                    className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white"
                                />
                                <span className="text-sm text-neutral-300 w-12 text-right font-mono">
                                    {distanceThreshold.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex gap-6">
                                {/* Board Visualization */}
                                <div className="relative flex-1 aspect-[4/3] bg-neutral-100 rounded-lg overflow-visible">
                                    {/* Lines and Arrows SVG */}
                                    <svg
                                        className="w-full h-full absolute inset-0 pointer-events-none"
                                        viewBox="0 0 500 500"
                                        preserveAspectRatio="xMidYMid meet"
                                    >
                                        {/* Lines */}
                                        <line x1="250" y1="20" x2="250" y2="480" stroke="#404040" strokeWidth="2" />
                                        <line x1="-70" y1="250" x2="570" y2="250" stroke="#404040" strokeWidth="2" />

                                        {/* Arrows */}
                                        <path d="M250 15 L240 35 L260 35 Z" fill="#404040" />
                                        <path d="M250 485 L240 465 L260 465 Z" fill="#404040" />
                                        <path d="M-80 250 L-60 240 L-60 260 Z" fill="#404040" />
                                        <path d="M580 250 L560 240 L560 260 Z" fill="#404040" />
                                    </svg>

                                    {/* Axis Labels */}
                                    <div className="absolute top-13 left-1/2 -translate-x-1/2 px-2 py-1 bg-white border border-neutral-400 rounded text-sm text-neutral-800">
                                        Good
                                    </div>
                                    <div className="absolute bottom-13 left-1/2 -translate-x-1/2 px-2 py-1 bg-white border border-neutral-400 rounded text-sm text-neutral-800">
                                        Evil
                                    </div>
                                    <div className="absolute left-13 top-1/2 -translate-y-1/2 px-2 py-1 bg-white border border-neutral-400 rounded text-sm text-neutral-800">
                                        Lawful
                                    </div>
                                    <div className="absolute right-13 top-1/2 -translate-y-1/2 px-2 py-1 bg-white border border-neutral-400 rounded text-sm text-neutral-800">
                                        Chaotic
                                    </div>

                                    {/* Sandwiches */}
                                    {filteredConsensusSandwiches.map((sandwich) => (
                                        <video
                                            key={sandwich.id}
                                            src={sandwich.imagePath}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            onClick={() => setSelectedConsensusSandwich(sandwich)}
                                            className={`absolute w-28 h-20 object-contain -translate-x-1/2 -translate-y-1/2 cursor-pointer z-40
                                                ${selectedConsensusSandwich?.id === sandwich.id ? 'ring-2 ring-black rounded-xl' : ''}`}
                                            style={{
                                                left: `${((sandwich.avgX + 1) / 2) * 100}%`,
                                                top: `${((sandwich.avgY + 1) / 2) * 100}%`
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Sandwich Inspector */}
                                <div className="w-80 bg-neutral-800 rounded-lg p-6">
                                    <h3 className="text-xl font-bold mb-6 text-center">Sandwich Inspector</h3>

                                    {!selectedConsensusSandwich ? (
                                        <div className="flex flex-col items-center justify-center h-[300px] text-neutral-500">
                                            No sandwich selected
                                            <span className="text-sm mt-2">(Click on a sandwich to select)</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <video
                                                src={selectedConsensusSandwich.imagePath}
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                className="max-w-[90%] h-48 object-contain rounded-lg mb-4"
                                            />

                                            <div className="w-full mt-4">
                                                <div className="mb-4">
                                                    <p className="text-neutral-500 text-sm">Name:</p>
                                                    <p className="text-lg">{selectedConsensusSandwich.name}</p>
                                                </div>
                                                <div className="mb-4">
                                                    <p className="text-neutral-500 text-sm">Vote Count:</p>
                                                    <p className="text-lg">{selectedConsensusSandwich.count} / {submittedBoards.length} submissions</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-neutral-500 text-sm">X-Axis:</p>
                                                        <p>
                                                            {selectedConsensusSandwich.avgX >= 0
                                                                ? `${Math.round(selectedConsensusSandwich.avgX * 100)}% Chaotic`
                                                                : `${Math.round(-selectedConsensusSandwich.avgX * 100)}% Lawful`}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-neutral-500 text-sm">Y-Axis:</p>
                                                        <p>
                                                            {selectedConsensusSandwich.avgY <= 0
                                                                ? `${Math.round(-selectedConsensusSandwich.avgY * 100)}% Good`
                                                                : `${Math.round(selectedConsensusSandwich.avgY * 100)}% Evil`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Extreme Sandwiches */}
                            {extremeSandwiches && (
                                <div className="mt-6 space-y-2">
                                    <div
                                        className="flex items-center gap-4 p-3 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors"
                                        onClick={() => setSelectedConsensusSandwich(extremeSandwiches.mostChaotic)}
                                    >
                                        <span className="text-neutral-400 w-28 text-sm">Most Chaotic</span>
                                        <video
                                            src={extremeSandwiches.mostChaotic.imagePath}
                                            autoPlay loop muted playsInline
                                            className="w-16 h-10 object-contain"
                                        />
                                        <span className="flex-1">{extremeSandwiches.mostChaotic.name}</span>
                                        <span className="text-neutral-400">{Math.round(extremeSandwiches.mostChaotic.avgX * 100)}%</span>
                                    </div>
                                    <div
                                        className="flex items-center gap-4 p-3 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors"
                                        onClick={() => setSelectedConsensusSandwich(extremeSandwiches.mostLawful)}
                                    >
                                        <span className="text-neutral-400 w-28 text-sm">Most Lawful</span>
                                        <video
                                            src={extremeSandwiches.mostLawful.imagePath}
                                            autoPlay loop muted playsInline
                                            className="w-16 h-10 object-contain"
                                        />
                                        <span className="flex-1">{extremeSandwiches.mostLawful.name}</span>
                                        <span className="text-neutral-400">{Math.round(Math.abs(extremeSandwiches.mostLawful.avgX) * 100)}%</span>
                                    </div>
                                    <div
                                        className="flex items-center gap-4 p-3 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors"
                                        onClick={() => setSelectedConsensusSandwich(extremeSandwiches.mostGood)}
                                    >
                                        <span className="text-neutral-400 w-28 text-sm">Most Good</span>
                                        <video
                                            src={extremeSandwiches.mostGood.imagePath}
                                            autoPlay loop muted playsInline
                                            className="w-16 h-10 object-contain"
                                        />
                                        <span className="flex-1">{extremeSandwiches.mostGood.name}</span>
                                        <span className="text-neutral-400">{Math.round(Math.abs(extremeSandwiches.mostGood.avgY) * 100)}%</span>
                                    </div>
                                    <div
                                        className="flex items-center gap-4 p-3 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors"
                                        onClick={() => setSelectedConsensusSandwich(extremeSandwiches.mostEvil)}
                                    >
                                        <span className="text-neutral-400 w-28 text-sm">Most Evil</span>
                                        <video
                                            src={extremeSandwiches.mostEvil.imagePath}
                                            autoPlay loop muted playsInline
                                            className="w-16 h-10 object-contain"
                                        />
                                        <span className="flex-1">{extremeSandwiches.mostEvil.name}</span>
                                        <span className="text-neutral-400">{Math.round(extremeSandwiches.mostEvil.avgY * 100)}%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminAuthenticated;

import { useState } from 'react';

function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
    setIsLoading(false);
  };

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

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
        <h1 className="text-2xl mb-6">Admin Dashboard</h1>
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
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
                <h3 className="text-lg mb-2">Axis Labels</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(generatedData.axisLabels as {
                    top: string;
                    bottom: string;
                    left: string;
                    right: string;
                  }).map(([key, value]) => (
                    <div key={key} className="bg-gray-700 p-2 rounded">
                      <span className="font-semibold">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg mb-2">Sandwiches</h3>
                <div className="space-y-2">
                  {generatedData.sandwichesOnBoard.map((sandwich: any) => (
                    <div key={sandwich.id} className="bg-gray-700 p-2 rounded">
                      ID: {sandwich.id}, X: {sandwich.x}, Y: {sandwich.y}
                    </div>
                  ))}
                </div>
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

  return (
    <div className="bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-[400px]">
        <h2 className="text-2xl text-gray-200 mb-6">Admin Login</h2>
        <div className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            className="w-full p-2 rounded bg-gray-700 text-gray-200 border border-gray-600 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              'Login'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
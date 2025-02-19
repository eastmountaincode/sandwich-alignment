import { useState } from 'react';

function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  if (isAuthenticated) {
    return (      <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
        <h1 className="text-2xl mb-6">Admin Dashboard</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl mb-4">Welcome to the admin page!</h2>
        </div>
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
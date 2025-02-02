import { useState } from 'react'
import Header from './components/Header'
import SandwichAlignmentGame from './components/SandwichAlignmentGame'
import About from './components/About'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('game')

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-2">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-5xl mx-auto mt-8 mb-12 px-4">
          {activeTab === 'game' && <SandwichAlignmentGame />}
          {activeTab === 'about' && <About />}
      </main>
    </div>
  )
}

export default App

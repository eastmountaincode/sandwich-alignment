import { useState } from 'react'
import Header from './components/Header'
import SandwichAlignmentGame from './components/SandwichAlignmentGame'
import About from './components/About'
import './App.css'
import { useDispatch } from 'react-redux'
import { setSelectedSandwich } from './store/selectedSandwichSlice'

function App() {
  const [activeTab, setActiveTab] = useState('game')
  const dispatch = useDispatch()

  const handlePageClick = () => {
    dispatch(setSelectedSandwich(null))
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-2 text-gray-200" onClick={handlePageClick}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-5xl mx-auto mt-8 mb-12 px-2">
          {activeTab === 'game' && <SandwichAlignmentGame />}
          {activeTab === 'about' && <About />}
      </main>
    </div>
  )
}

export default App

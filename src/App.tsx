import { useState } from 'react'
import Header from './components/Header'
import SandwichAlignmentGame from './components/SandwichAlignmentGame'
import About from './components/About'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('game')

  return (
    <div className='p-4'>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className='max-w-4xl mx-auto mt-8'>
          {activeTab === 'game' && <SandwichAlignmentGame />}
          {activeTab === 'about' && <About />}
      </main>
    </div>
  )
}

export default App

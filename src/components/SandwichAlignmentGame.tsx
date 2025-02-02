import { useEffect, useState } from "react"

function SandwichAlignmentGame() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <>
      {/* Main game content - only visible above 1024px */}
      <div className="hidden lg:flex flex-col gap-4 w-full">
        <h1 className="text-4xl text-gray-200 text-center">Sandwich Alignment Game</h1>

        <div className="w-full h-24 bg-gray-800 rounded-lg p-4">
          {/* Control panel content will go here */}
        </div>

        <div className="flex gap-4">
          <div className="w-[675px] h-[500px] bg-gray-800 rounded-lg">
            {/* Alignment board content */}
          </div>

          <div className="flex-1 bg-gray-800 rounded-lg">
            {/* Inspector content */}
          </div>
        </div>

        <div className="w-full h-32 bg-gray-800 rounded-lg p-4">
          {/* Carousel content will go here */}
        </div>
      </div>

      {/* Splash screen - only visible below 1024px */}
      <div className="lg:hidden flex flex-col items-center justify-center text-gray-200 p-8 text-center">
        <h1 className="text-5xl font-bold mb-8 tracking-tight">Sandwich Alignment Game</h1>

        <p className="text-2xl font-medium mb-4">
          Please view on a larger screen
        </p>

        <p className="text-xl text-gray-400">
          (minimum width: 1024px)
        </p>

        <p className="text-lg text-gray-400 mt-6">
          Current width: {windowWidth}px
        </p>

        <p className="text-4xl mt-8">🥪</p>
      </div>
    </>
  )
}

export default SandwichAlignmentGame

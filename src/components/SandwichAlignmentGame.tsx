import AlignmentBoard from "./AlignmentBoard"
import ControlPanel from "./ControlPanel"
import SplashScreen from "./SplashScreen"

function SandwichAlignmentGame() {
  
  return (
    <>
      {/* Main game content - only visible above 1024px */}
      <div className="hidden lg:flex flex-col gap-4 w-full">

        <div className="w-full h-24 bg-gray-800 rounded-lg p-4">
          <ControlPanel />
        </div>

        <div className="flex gap-4">
          <div className="w-[675px] h-[550px] bg-gray-800 rounded-lg">
            <AlignmentBoard />
          </div>

          <div className="flex-1 bg-gray-800 rounded-lg">
            {/* Inspector content */}
          </div>
        </div>

        <div className="w-full h-24 bg-gray-800 rounded-lg p-4">
          {/* Carousel content will go here */}
        </div>
      </div>

      {/* Splash screen - only visible below 1024px */}
      <SplashScreen />
    </>
  )
}

export default SandwichAlignmentGame

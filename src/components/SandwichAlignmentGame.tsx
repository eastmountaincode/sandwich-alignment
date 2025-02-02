import { useDispatch } from "react-redux"
import AlignmentBoard from "./AlignmentBoard"
import ControlPanel from "./ControlPanel"
import SandwichCarousel from "./SandwichCarousel"
import SandwichInspector from "./SandwichInspector"
import SplashScreen from "./SplashScreen"
import { setSelectedSandwich } from "../store/selectedSandwichSlice"

function SandwichAlignmentGame() {

  const dispatch = useDispatch()
  const handleBackgroundClick = () => {
    dispatch(setSelectedSandwich(null))
  }

  return (
    <>
      {/* Main game content - only visible above 1024px */}
      <div className="hidden lg:flex flex-col gap-4 w-full" onClick={handleBackgroundClick}>

        <div className="w-full h-16 bg-gray-800 rounded-lg flex items-center">
          <ControlPanel />
        </div>

        <div className="flex gap-4">
          <div className="w-[650px] h-[550px] bg-gray-800 rounded-lg">
            <AlignmentBoard />
          </div>

          <div className="flex-1 bg-gray-800 rounded-lg">
            <SandwichInspector />
          </div>
        </div>

        <div className="w-full h-48 bg-gray-800 rounded-lg p-4">
          <SandwichCarousel />
        </div>
      </div>

      {/* Splash screen - only visible below 1024px */}
      <SplashScreen />
    </>
  )
}

export default SandwichAlignmentGame

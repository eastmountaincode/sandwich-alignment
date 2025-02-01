interface HeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }
  
  function Header({ activeTab, setActiveTab }: HeaderProps) {
    const getTabClasses = (tabName: string) => {
      const baseClasses = "inline-block p-4 border-b-2 rounded-t-lg cursor-pointer"
      return `${baseClasses} ${
        activeTab === tabName 
          ? "text-purple-500 border-purple-500"
          : "border-transparent text-grey-400 hover:text-gray-300 border-gray-700 hover:border-gray-300"
      }`
    }
  
    return (
      <div className="text-gray-400 border-b-2 border-gray-600 mb-4">
        <ul className="flex text-md font-medium text-center">
          <li 
            className={`me-2 ${getTabClasses('game')}`}
            onClick={() => setActiveTab('game')}
          >
            Sandwich Alignment Game
          </li>
          <li 
            className={`me-2 ${getTabClasses('about')}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </li>
        </ul>
      </div>
    )
  }
  
  export default Header
  
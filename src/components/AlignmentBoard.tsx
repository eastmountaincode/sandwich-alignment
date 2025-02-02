function AlignmentBoard() {
  return (
    <div className="relative w-full h-full bg-gray-200 rounded-lg">
      <svg
        className="w-full h-full"
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Lines */}
        <line x1="250" y1="20" x2="250" y2="480" stroke="#1f2937" strokeWidth="2" />
        <line x1="-35" y1="250" x2="535" y2="250" stroke="#1f2937" strokeWidth="2" />

        {/* Arrows */}
        <path d="M250 15 L240 35 L260 35 Z" fill="#1f2937" />
        <path d="M250 485 L240 465 L260 465 Z" fill="#1f2937" />
        <path d="M-40 250 L-20 240 L-20 260 Z" fill="#1f2937" />
        <path d="M540 250 L520 240 L520 260 Z" fill="#1f2937" />
      </svg>

      {/* Labels as HTML elements instead of SVG text */}
      <div className="text-gray-800">
        <div className="absolute top-14 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-100 border border-gray-400 rounded text-sm">Good</div>
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-100 border border-gray-400 rounded text-sm">Evil</div>
        <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-100 border border-gray-400 rounded text-sm">Lawful</div>
        <div className="absolute right-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-100 border border-gray-400 rounded text-sm">Chaotic</div>
      </div>
    </div>
  )
}

export default AlignmentBoard

import React from 'react'

function Loader() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-6.5rem)] ">
  <div className="flex space-x-2">
    <div className="w-2 h-8 bg-indigo-500 animate-bounce"></div>
    <div className="w-2 h-12 bg-indigo-400 animate-bounce delay-75"></div>
    <div className="w-2 h-6 bg-indigo-300 animate-bounce delay-150"></div>
    <div className="w-2 h-10 bg-indigo-200 animate-bounce delay-75"></div>
    <div className="w-2 h-8 bg-indigo-100 animate-bounce"></div>
  </div>
</div>
  )
}

export default Loader
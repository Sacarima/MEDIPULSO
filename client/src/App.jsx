import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <p className="text-2xl mb-4">You clicked {count} times</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Click me
      </button>
    </div>
  )
}

export default App
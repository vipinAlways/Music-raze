import Link from 'next/link'
import React from 'react'

function Error() {
  return (
    <div>
        <div className="flex items-center justify-center h-[60vh]  bg-[#FBF2EA] text-black">
  <div className="text-center">
  
    <h1 className="text-9xl font-bold text-indigo-500">404</h1>
    <p className="text-2xl md:text-3xl font-light mb-4">Oops! It looks like Error.</p>
    <p className="text-lg mb-8">The page you're looking for isn't available right now. Let's get back to the rhythm!</p>


    <div className="mb-8">
      🎶 <span className="text-indigo-500">🎵</span> <span className="text-indigo-400">🎧</span>
    </div>

   
    <Link href="/dashboard" className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md transition">
      Back to Home
    </Link>
  </div>
</div>

    </div>
  )
}

export default Error
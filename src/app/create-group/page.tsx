import React from 'react'
import Create from './Create'
import Link from 'next/link'


function page() {
  return (
    <div className='h-full w-full mt-3'>
        <Link
        href="/dashboard"
        className="bg-[#7C3AED] lg:w-44 w-20 max-sm:mb-5 text-lg  text-center p-2 lg:text-lg lg:px-3 py-1.5 rounded-md text-slate-300"
      >
        Back to Dashboard
      </Link>
      <Create/>
    </div>
  )
}

export default page
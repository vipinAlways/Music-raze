'use client'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import SreachSong from '@/components/SreachSong'

function page() {
    // const {data} = useQuery({
    //     queryKey:['group details'],
    //     queryFn:async () => Group()
    // })
  return (
  <div>
    <SreachSong/>
  </div>
  )
}

export default page
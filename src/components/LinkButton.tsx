'use client'
import { getGroup } from '@/app/actionFn/getAllGrpName'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

import React from 'react'
interface getGroup{
    className:string,
    groupID :string,
  
}


function LinkButton({className,groupID}:getGroup) {
    const id = groupID
    const {} = useQuery({
        queryKey:['group-page'],
        queryFn:async ()=> getGroup(id)
    })
  return (
    <Link href='group' className={`${className}`}>
       view Group
    </Link>
  )
}

export default LinkButton
'use client'

import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

function page() {

    const session = useSession()
    const userProfile =  session?.data?.user?.image ?? 'https://imgs.search.brave.com/PC4fwi9FJFHjkFy_kQz-geTX3f0I2KqY8yEXMhzdjYU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by91/c2VyLXByb2ZpbGUt/aWNvbi1mcm9udC1z/aWRlLXdpdGgtd2hp/dGUtYmFja2dyb3Vu/ZF8xODcyOTktNDAw/MTAuanBnP3NpemU9/NjI2JmV4dD1qcGc'

    const userName = session?.data?.user?.name ?? `user`
  return (
  <div className='flex flex-col gap-16'>
      <div className='flex items-center mt-10 justify-between'>
        <div className='flex items-center gap-20  h-96  w-2/3 px-10'>
            <div className='rounded-full sm:rounded-full w-96 h-full   p-0.5'>
                <img src={userProfile} alt="profile picture"  className='object-contain  rounded-full max-sm:rounded-full w-full shrink-0 shadow-md' />
            </div>
            <div className='flex flex-col  items-center h-60 pt-10 '>
                   <div>
                   <h1 className='text-xl'>
                        @ {userName}
                    </h1>
                   </div>
                
                <div className='flex items-center h-full gap-4'>
                    <Link href="/create-group">
                    <Button>
                        Create Group
                        </Button></Link>
                    <Link href="/join-group">
                    <Button>
                        Join Group
                        </Button></Link>
                </div>

            </div>
        </div>

        <div>
            <Button  className='rotate-90 text-3xl leading-none p-8 '>
               FAVOURITE SONGS
            </Button>
        </div>

    </div>

    <div className='flex items-center justify-around'>
            <Link href='joined-group'>
            <Button  className='text-xl lg:text-2xl p-6'>
                JOINED GROUP
            </Button>
            </Link>
            <Link href='user-group'>
            <Button  className='text-xl lg:text-2xl p-6'>
                YOUR GROUP
            </Button>
            </Link>
    </div>
  </div>
  )
}

export default page
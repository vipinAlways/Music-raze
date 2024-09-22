"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

function page() {
  const session = useSession();

  if (!session.data?.user?.email) {
    return "hello";
  }

  const userProfile =
    session.data.user.image ??
    "https://imgs.search.brave.com/PC4fwi9FJFHjkFy_kQz-geTX3f0I2KqY8yEXMhzdjYU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by91/c2VyLXByb2ZpbGUt/aWNvbi1mcm9udC1z/aWRlLXdpdGgtd2hp/dGUtYmFja2dyb3Vu/ZF8xODcyOTktNDAw/MTAuanBnP3NpemU9/NjI2JmV4dD1qcGc";

  const userName = session?.data?.user?.name ?? `user`;
 
  return (
    <div className="flex flex-col gap-16 text-slate-200">
      <div className="flex items-start mt-10  px-7 sm:px-1.5 gap-1 sm:gap-0 flex-1 justify-between  ">
        <div className="flex items-center gap-10  h-96  w-2/3 sm:w-3/5  px-10 sm:px-2">
          <div className="rounded-full flex justify-center items-center sm:rounded-full w-96 sm:w-96 h-full p-0.5">
            <img
              src={userProfile}
              alt="profile picture"
              className="object-contain  rounded-full w-full shrink-0 shadow-md"
            />
          </div>
          <div className="flex flex-col  items-center h-60 pt-10 ">
            <div>
              <h1 className="text-xl lg:text-3xl">
                @ {userName}
              </h1>
            </div>

            <div className="flex items-center h-full ">
              <Link href="/create-group">
                <Button className="text-xl lg:text-2xl">Create Group</Button>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col items-center justify-center w-full ">
            <h1 className="text-xl lg:text-3xl bg-[#7C3AED] p-3 rounded-lg items-start w-80 sm:w-60 text-center">Favorite Songs</h1>
            <div>
              <ul>
                {
                  <li>

                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-10">
        <Link href="joined-group">
          <Button className="text-xl lg:text-2xl p-6">JOINED GROUP</Button>
        </Link>
        <Link href="/dashboard/user-group">
          <Button className="text-xl lg:text-2xl p-6">YOUR GROUP</Button>
        </Link>
      </div>
    </div>
  );
}

export default page;
 
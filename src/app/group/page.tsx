"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGroup, getMembers, getUser } from "../actionFn/getAllGrpName";
import SreachSong from "@/components/SreachSong";
import { useGroup } from "@/components/GroupContextType ";
import Loader from "@/components/Loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";


function Page() {
  const { groupID } = useGroup();
  // const [ memberID ,setMemberId ]= useState('')


  const { data, isError, isLoading } = useQuery({
    queryKey: ["group-data", groupID],
    queryFn: async () => getGroup(groupID),
    enabled: !!groupID,
  });
  const userData = useQuery({
    queryKey: ["admin-data", data?.admin],
    queryFn: async () => getUser(data?.admin ?? ""),
    enabled: !!data?.admin ?? "",
  });


  const memberData = useQuery({
    queryKey: ["members-data", data?.members],
    queryFn: async () => getMembers(data?.members ?? []),
    enabled: !!data?.members ?? "",
  });

  console.log(data);
  if (isLoading) {
    <Loader />;
  }
  if (userData.data === undefined || groupID === '') {
   return(
    <div>
    <div>
      <div className="flex items-center justify-around  h-[70vh]  bg-[#FBF2EA] text-black">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-indigo-500">404</h1>
          
          <p className="text-lg mb-8">
            The page you're looking for isn't available right now. Let's get
            back to the rhythm!
          </p>

          <div className="mb-8">
            🎶 <span className="text-indigo-500">🎵</span>{" "}
            <h1 className="text-2xl lg:text-4xl">Select the group</h1>
            <span className="text-indigo-400">🎧</span>
          </div>

        
        </div>
      </div>
    </div>
  </div>
   )
  }

   
  return (
    <div className="flex flex-col gap-9">
      <div>
        <Button>
          <Link href='/dashboard'>
          Back TO Dashboard
          </Link>
        </Button>
      </div>
      <SreachSong />

     <div className="flex justify-between">
     <div className="h-full w-full flex flex-col items-start gap-7">
        <h1 className="text-xl lg:text-3xl text-slate-200">
          || {data?.groupName} ||
        </h1>

        <h1 className="flex gap-3 text-lg  items-center text-red-500 h-10 ">
          <span className="text-xl lg:text-3xl text-slate-200">Admin : </span>
          {userData.data?.userName}
        </h1>
      </div>

      <div className="w-3/5 overflow-auto">
          {data?.members.length!> 0 ? memberData.data?.map((member) => (
            <div key={member.id} className="w-10 h-10">
              {member.userName}
            </div>
          )) : <div>
            no one currectly
            </div>}
        </div>
     </div>
    </div>
  );
}

export default Page;

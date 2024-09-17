"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGroup, getMembers, getUser } from "../actionFn/getAllGrpName";
import SreachSong from "@/components/SreachSong";
import { useGroup } from "@/components/GroupContextType ";
import Loader from "@/components/Loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
  if (userData.data === undefined || groupID === "") {
    return (
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
    );
  }

  return (
    <div className="flex flex-col gap-9">
      <div>
        <Button>
          <Link href="/dashboard">Back TO Dashboard</Link>
        </Button>
      </div>
      <SreachSong />

      <div className="flex justify-between lg:pr-28">
        <div className="h-full w-full flex flex-col items-start gap-7">
          <h1 className="text-xl lg:text-3xl text-slate-200">
            || {data?.groupName} ||
          </h1>

          <h1 className="flex gap-3 text-lg  items-center text-red-500 h-10 ">
            <span className="text-xl lg:text-3xl text-slate-200">Admin : </span>
            {userData.data?.userName}
          </h1>
        </div>

        <div className="w-2/5  flex items-center justify-start  overflow-auto memberName">
          {data?.members.length! > 0 ? (
            memberData.data?.map((member) => (
              <div
                key={member.id}
                className="w-16 flex flex-col text-center justify-center items-center h-16 border-2 bg-white text-slate-900  rounded-full text-xs"
              >
                {member.userName}
              </div>
            ))
          ) : (
            <div className="text-slate-200 text-xl lg:text-2xl">
              no one currently &#128577;
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex items-center justify-between flex-1 ">
        <div className="flex w-60 flex-col gap-1 h-fit p-1 border rounded-lg ">
          <div className="h-60 w-full bg-slate-200 rounded-lg rounded-b-none">
            <img src="" alt="" />
          </div>
          <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-2xl text-center py-1 rounded-lg rounded-t-none">
            hello
          </div>
          <h1 className="text-slate-200  text-center">Current Song</h1>
        </div>
          <div className="w-[calc(80vw-15rem)] border-2 bg-gray-700 rounded-lg upcomingSongs bg-opacity-80 p-2">
          <div className="flex w-60 flex-col gap-1 h-fit p-1 border rounded-lg ">
          <div className="h-60 w-full bg-slate-200 rounded-lg rounded-b-none">
            <img src="" alt="" />
          </div>
          <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-2xl text-center py-1 rounded-lg rounded-t-none">
            hello
          </div>
          <h1 className="text-slate-200 bg-gray-800 text-center"></h1>
        </div>
          </div>
      </div>
    </div>
  );
}

export default Page;

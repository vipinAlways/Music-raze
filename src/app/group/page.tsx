"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGroup, getMembers, getUser } from "../actionFn/getAllGrpName";
import SreachSong from "@/components/SreachSong";
import Loader from "@/components/Loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StartStream from "@/components/StartStream";

import { useGroup } from "@/components/GroupContextType ";
import { findStream } from "./action";

function Page() {
  const { groupID } = useGroup();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["group-data", groupID],
    queryFn: () => getGroup(groupID),
    enabled: !!groupID,
  });

  const userData = useQuery({
    queryKey: ["admin-data", data?.admin],
    queryFn: () => getUser(data?.admin ?? ""),
    enabled: !!data?.admin,
  });

  const memberData = useQuery({
    queryKey: ["members-data", data?.members],
    queryFn: () => getMembers(data?.members ?? []),
    enabled: !!data?.members,
  });

  const stream = useQuery({
    queryKey: ['get-stream'],
    queryFn: async () => findStream({ grpId: groupID })
  });

  if (isLoading) return <Loader />;
  console.log('`first`', data?.ActiveStreams);
  console.log(stream.data);
  return (
    <div className="flex flex-col gap-9">
      <Button className="w-32">
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
      <SreachSong currentgrpId = {groupID} />

      <div className="flex justify-between lg:pr-28">
        <div className="h-full w-full flex flex-col items-start gap-7">
          <h1 className="text-xl lg:text-3xl text-slate-200">|| {data?.groupName} ||</h1>
          <h1 className="flex gap-3 text-lg items-center text-red-500 h-10">
            <span className="text-xl lg:text-3xl text-slate-200">Admin:</span> {userData.data?.userName}
          </h1>
        </div>
        <div className="w-2/5 flex items-center justify-start overflow-auto">
          {data?.members.length ? (
            memberData.data?.map((member) => (
              <div key={member.id} className="w-16 flex flex-col text-center justify-center items-center h-16 border-2 bg-white text-slate-900 rounded-full text-xs">
                {member.userName}
              </div>
            ))
          ) : (
            <div className="text-slate-200 text-xl lg:text-2xl">no one currently &#128577;</div>
          )}
        </div>
      </div>

      {data?.streamId ? (
        <div className="w-full flex items-center justify-between">
          <div className="flex w-60 flex-col gap-1 h-fit p-1 border rounded-lg">
            <div className="h-60 w-full bg-slate-200 rounded-lg"></div>
            <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-2xl text-center py-1 rounded-lg">hello</div>
            <h1 className="text-slate-200 text-center">Current Song</h1>
          </div>
          <div className="w-[calc(80vw-15rem)] border-2 bg-gray-700 rounded-lg p-2">
            <div className="flex w-60 flex-col gap-1 h-fit p-1 border rounded-lg">
              <div className="h-60 w-full bg-slate-200"></div>
              <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-2xl text-center py-1 rounded-lg">hello</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center min-h-32 justify-between mt-20">
          <h1 className="w-full text-center lg:text-3xl text-slate-200">Currently no stream</h1>
          <div className="w-full flex items-center justify-center lg:text-xl">
            <StartStream grpid={groupID} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;

"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getGroup, getMembers, getUser } from "../actionFn/getAllGrpName";
import SreachSong from "@/components/SreachSong";
import Loader from "@/components/Loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StartStream from "@/components/StartStream";
import { findStream } from "./action";
import { useGroup } from "@/components/GroupContextType ";
import SongsQueue from "@/components/SongsQueue";

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

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="flex flex-col gap-9 ">
      
        <Link href="/dashboard" className="bg-[#7C3AED] w-44 text-center text-lg px-3 py-1.5 rounded-md text-slate-300">Back to Dashboard</Link>
  
      <SreachSong currentgrpId={groupID} />
      <div className="flex flex-col justify-between lg:pr-28 mb-4">
        <div className="h-full w-full flex flex-col items-start  gap-4">
          <h1 className="text-xl lg:text-4xl text-purple-300">
            {data?.groupName}
          </h1>

        <div className="text-center">
            <h1>Members : {data?.members.length}</h1>
          </div>
        </div>
      </div>

      {data?.streamId ? (
        <div>
          <SongsQueue />
        </div>
      ) : (
        <div className="flex flex-col items-center min-h-32 justify-between mt-20">
          <div className="w-full flex items-center justify-center lg:text-xl">
            <StartStream grpid={groupID} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;

"use client";

import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getGroup, getMembers, getUser } from "../actionFn/getAllGrpName";
import SreachSong from "@/components/SreachSong";
import Loader from "@/components/Loader";
import Link from "next/link";

import StartStream from "@/components/StartStream";

import { useGroup } from "@/components/GroupContextType ";
import SongsQueue from "@/components/SongsQueue";

function Page() {
  const { groupID } = useGroup();
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["group-data", groupID],
    queryFn: () => getGroup(groupID),
    enabled: !!groupID,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });


  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="flex flex-col gap-9 ">
      <Link
        href="/dashboard"
        className="bg-[#7C3AED] lg:w-44 w-32 max-sm:mt-4 text-sm text-center px-0.5 lg:text-lg lg:px-3 py-1.5 rounded-md text-slate-300"
      >
        Back to Dashboard
      </Link>

      <div>
      <SreachSong currentgrpId={groupID} />
      </div>
      <div className="flex flex-col justify-between lg:pr-28 mb-4">
        <div className="h-full w-full flex flex-col items-start  gap-4">
          <h1 className="text-3xl lg:text-4xl text-purple-300 ">
            {data?.groupName}
          </h1>

          <div className="text-center">
            <h1>Members : {data?.members.length}</h1>
          </div>
        </div>
      </div>

      <div>
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
    </div>
  );
}

export default Page;

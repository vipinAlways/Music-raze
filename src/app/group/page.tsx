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
    <div className="flex flex-col gap-9">
      <Button className="w-32">
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
      <SreachSong currentgrpId={groupID} />
      <div className="flex justify-between lg:pr-28">
        <div className="h-full w-full flex flex-col items-start gap-7">
          <h1 className="text-xl lg:text-3xl text-slate-200">
            || {data?.groupName} ||
          </h1>
          <h1 className="flex gap-3 text-lg items-center text-red-500 h-10">
            <span className="text-xl lg:text-3xl text-slate-200">Admin:</span>{" "}
            {userData.data?.userName}
          </h1>
        </div>
        <div className="w-2/5 flex items-center justify-start overflow-auto">
          {data?.members.length ? (
            memberData.data?.map((member) => (
              <div
                key={member.id}
                className="w-16 flex flex-col text-center justify-center items-center h-16 border-2 bg-white text-slate-900 rounded-full text-xs"
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

      {data?.streamId ? (
       <div>
        <SongsQueue/>
       </div>
      ) : (
        <div className="flex flex-col items-center min-h-32 justify-between mt-20">
          <h1 className="w-full text-center lg:text-3xl text-slate-200">
            Currently no stream
          </h1>
          <div className="w-full flex items-center justify-center lg:text-xl">
            <StartStream grpid={groupID} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;

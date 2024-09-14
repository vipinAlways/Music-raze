"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getGroup } from "../actionFn/getAllGrpName";
// import { useGroup } from "@/context/GroupContext"; // Import the custom hook
import SreachSong from "@/components/SreachSong";
import { useGroup } from "@/components/GroupContextType ";

function Page() {
  const { groupID } = useGroup(); // Access groupID from context

  const { data, isError, isLoading } = useQuery({
    queryKey: ["group-data", groupID], // Include groupID in the query key so it refetches when it changes
    queryFn: async () => getGroup(groupID),
    enabled: !!groupID, // Only run the query if groupID is not empty
  });

  console.log(data);

  return (
    <div>
      <SreachSong />

      <div className="h-10 w-10">{data?.groupName}</div>
    </div>
  );
}

export default Page;

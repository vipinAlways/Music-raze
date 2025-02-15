"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGroup } from "../actionFn/getAllGrpName";
import SreachSong from "@/components/SreachSong";
import Loader from "@/components/Loader";
import Link from "next/link";
import StartStream from "@/components/StartStream";
import { useGroup } from "@/components/GroupContextType ";
import SongsQueue from "@/components/SongsQueue";
import { checkMember, updateMemberList, updateMemberListDelete } from "./action";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


function Page() {

  
  const { groupID } = useGroup();
  const [isMember, setIsMember] = useState(false);
  const [count, setCount] = useState();
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["group-data", groupID],
    queryFn: () => getGroup(groupID),
    enabled: !!groupID,
    
  });

  const { data: user } = useQuery({
    queryKey: ["member"],
    queryFn: async () => checkMember(),
  });

  const memberList = useMutation({
    mutationKey:['update-member-list'],
    mutationFn:updateMemberList,
    onError:()=>{},
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['group-data']})
    }
  })
  const memberListDelte = useMutation({
    mutationKey:['update-member-list'],
    mutationFn:updateMemberListDelete,
    onError:()=>{},
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['group-data']})
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    }
  })

  const upMemList = ()=>{
    memberList.mutate(groupID)
  }
  const upMemListdel = ()=>{
    alert('DO you Really want us to leave')
    memberListDelte.mutate(groupID)
  }


  useEffect(() => {
    if (data?.members && user?.id) {
      const check = data.members.some((result) => result === user.id);
      const malik = data.admin === user.id;
      
      if (check || malik) {
        setIsMember(true);
      }
    }
  }, [data,data?.members, user?.id,queryClient]);


 


  

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="flex flex-col gap-9">
      <Link
        href="/dashboard"
        className="bg-[#7C3AED] lg:w-44 w-32 max-md:mt-4 text-sm text-center px-0.5 lg:text-lg lg:px-3 py-1.5 rounded-md text-slate-300"
      >
        Back to Dashboard
      </Link>

      <div>
        <SreachSong currentgrpId={groupID} />
      </div>

      <div className="flex flex-col justify-between lg:pr-28 mb-4">
        <div className="h-full w-full flex flex-col items-start gap-4">
          <h1 className="text-3xl lg:text-4xl text-purple-300 ">
            {data?.groupName}
          </h1>

          <div className="text-center">
            <h1>Members: {data?.members.length}</h1>
          </div>
        </div>
      </div>


      <div className={cn(!isMember  ?  "w-full flex items-center  justify-center" :"hidden")}>
          <Button onClick={()=> upMemList()} className="text-3xl">
              Join Us
          </Button>
      </div>

      <div className={cn(isMember === true ? "" : "hidden")}>
        {(data?.streamId && isMember) ? (
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
        <div className={cn((!isMember  || (data?.admin === user?.id))?  "hidden" :"")}>
          <Button onClick={()=> upMemListdel()}>
              leave
          </Button>
      </div>
      </div>


      <div>
        <Button>
          +
        </Button>

        <p>{count}</p>
      </div>
    </div>
  );
}

export default Page;

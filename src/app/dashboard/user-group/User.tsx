"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { GetCreatedGrp } from "../action";
import Loader from "@/components/Loader";
import Error from "@/components/Error";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGroup } from "@/components/GroupContextType ";

function User() {
  const { groupID, setGroupID } = useGroup();
  const { data, isPending, isError } = useQuery({
    queryKey: ["get-user-created-grp"],
    queryFn: async () => GetCreatedGrp(),
  });

  return (
    <div>
      {isPending ? (
        <div>
          <Loader />
        </div>
      ) : isError ? (
        <Error />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-full flex justify-center items-center"></div>
          <ul className="w-full">
            {data.length > 0 ? (
              data.map((group) => (
                <li
                  key={group.id}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-medium text-blue-600">
                      {group.groupName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Members: {group.members.length}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {group.description || "No description available"}
                  </p>

                  <Button onClick={() => setGroupID(group.id)}>
                    <Link
                      href="/group"
                      className="p-2 rounded-md text-center font-bold w-full"
                    >
                      View Group
                    </Link>
                  </Button>
                </li>
              ))
            ) : (
              <div>
                <Error />
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default User;

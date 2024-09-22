"use client";
import { findStream } from "@/app/group/action";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useGroup } from "./GroupContextType ";

interface Song {
  id: string;
  streamId: string;
  url: string;
  image: string;
  title: string;
}

function SongsQueue() {
  const { groupID } = useGroup();

  const { data, error } = useQuery({
    queryKey: ["get-stream"],
    queryFn: async () => findStream({ groupID: groupID }),
  });

  if (error) {
    return <div>Error loading stream</div>;
  }

  if (!data?.url || data.url.length === 0) {
    return <div>No songs available</div>;
  }

  return (
    <div className="w-full flex items-center justify-between flex-1">
      <div className="flex w-60 flex-col gap-1  p-1 border h-72 rounded-lg">
      {
        data.url[0].url ? (  <div>
            <div className="h-60 w-full bg-slate-200 rounded-lg flex flex-col items-center relative">
              <img
                src={data.url[0].image ? data.url[0].image : ""}
                alt={data.url[0].image ? data.url[0].title : ""}
                className="h-48 p-2 w-full object-cover"
              />
              <audio src={data.url[0].url} controls className="p-2 w-full"></audio>
            </div>
            <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-2xl text-center py-1 rounded-lg">
              {data.url[0].title}
            </div>
            <h1 className="text-slate-200 text-center">Current Song</h1>
            </div>) :null
      }
      </div>
      <div className="w-[calc(80vw-15rem)] border-2 bg-gray-700 rounded-lg p-2 flex items-center gap-2 h-72 overflow-auto songqueue">
        {data.url.map((song: Song, index: number) => {
          return song.url ? (
            <div
              key={index}
              className="flex  min-w-60 sm:min-w-40 flex-col gap-1 h-full p-1 border rounded-lg sm:justify-around "
            >
              <div className="h-60 sm:h-40 w-full ">
                <img src={song.image} alt={song.title} />
              </div>
              <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-2xl text-center py-1 rounded-lg whitespace-nowrap overflow-auto title ">
                <h1>{song.title}</h1>
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

export default SongsQueue;

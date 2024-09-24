"use client";
import { findStream } from "@/app/group/action";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useGroup } from "./GroupContextType ";
import { Minus } from "lucide-react";
import ActiveSong from "./ActiveSong";

interface Song {
  id: string;
  streamId: string;
  url: string;
  image: string;
  title: string;
}

function SongsQueue() {
  const { groupID } = useGroup();
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data, error } = useQuery({
    queryKey: ["get-stream"],
    queryFn: async () => findStream({ groupID: groupID }),
  });
  const handleSongEnd = () => {
    setCurrentSongIndex((prevIndex) => {
      return prevIndex + 1 < data?.url.length! ? prevIndex + 1 : 0;
    });
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("ended", handleSongEnd);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [currentSongIndex, data?.url.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [currentSongIndex]);

  if (error) {
    return <div>Error loading stream</div>;
  }

  if (!data?.url || data.url.length === 0) {
    return <div>No songs available</div>;
  }

  return (
    <div className="w-full flex items-center justify-between flex-1">
      <div className="flex w-60 flex-col gap-1  p-1 border h-72 rounded-lg">
        <ActiveSong />
      </div>
      <div className="w-[calc(80vw-15rem)] border-2 bg-[#7C3AED] bg-opacity-20 rounded-lg p-2 lg:p-1 flex items-center gap-2 h-80 overflow-auto -z-20">
        {data.url.map((song: Song, index: number) => {
          return song.url ? (
            <div
              key={index}
              className="flex  lg:min-w-60 lg:max-w-60 sm:w-40 flex-col gap-1 h-full p-1 border rounded-lg sm:justify-around  relative"
            >
              <div
                className="absolute top-1.5 right-1 p-1 border bg-red-700 rounded-full"
                onClick={() => {}}
              >
                <Minus className="h-5 w-5" />
              </div>
              <div className="lg:h-56 sm:h-40 w-full  ">
                <img
                  src={song.image}
                  alt={song.title}
                  className="rounded-tr-3xl"
                />
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

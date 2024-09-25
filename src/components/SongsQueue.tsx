"use client";
import { findStream } from "@/app/group/action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useGroup } from "./GroupContextType ";
import { Minus } from "lucide-react";
import ActiveSong from "./ActiveSong";
import { dropUrl } from "@/app/actionFn/getAllGrpName";
import { cn } from "@/lib/utils";

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
  const queryClient = useQueryClient();
  const { data, error } = useQuery({
    queryKey: ["get-stream"],
    queryFn: async () => findStream({ groupID: groupID }),
  });
  const handleSongEnd = () => {
    setCurrentSongIndex((prevIndex) => {
      return prevIndex + 1 < data?.url.length! ? prevIndex + 1 : 0;
    });
  };

  const dropSong = useMutation({
    mutationKey:['drop-song'],
    mutationFn:dropUrl,
    onError:()=>{
      console.log('nahi hua');
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["get-active-stream"] });
      queryClient.invalidateQueries({ queryKey: ["get-stream"] });
    }
  })



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

  const handleDrop =(urlID:string)=>{
      dropSong.mutate(urlID)
      console.log(urlID);
  }

  if (error) {
    return <div>Error loading stream</div>;
  }

  if (!data?.url || data.url.length === 0) {
    return <div>No songs available</div>;
  }

  return (
    <div className="w-full flex items-start justify-between flex-1">
      <div className="flex w-3/5 flex-col   p-1  h-96 rounded-lg">
        <ActiveSong />
      </div>
      <div className="w-[35%] border-2 bg-[#7C3AED] bg-opacity-20 rounded-lg p-2 lg:p-1 flex flex-col items-center gap-2 h-[60vh] overflow-auto songList" >
        {data.url.length >0 ? data.url.map((song: Song, index: number) =>
          index >=data.currentSongIndex ? (
            <div
            key={index}
            className={cn("flex  lg:min-w-full lg:max-w-60 flex-col items-center h-52 p-1 border rounded-lg justify-around  relative",index === data.currentSongIndex ? 'opacity-75' :'opacity-100')}
          >
            <div
              className={cn("absolute top-1.5 right-1 p-1 border bg-red-600 rounded-full z-50 hover:bg-red-900 ",index === data.currentSongIndex ? 'hidden' :null)}
              onClick={() => handleDrop(song.id)}
            >
              <Minus className="hover:scale-105"/>
            </div>
            <div className="w-full">
              <img
                src={song.image}
                alt={song.title}
                className="rounded-tr-3xl object-contain lg:h-32 w-full "
              />
            </div>
            <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-xl text-center py-1 rounded-lg whitespace-nowrap overflow-auto title ">
              <h1>{song.title}</h1>
            </div>
          </div>
          ) : null
         ) : null}
      </div>
    </div>
  );
}

export default SongsQueue;

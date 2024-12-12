"use client";
import { findStream } from "@/app/group/action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useGroup } from "./GroupContextType ";
import { Minus } from "lucide-react";
import ActiveSong from "./ActiveSong";
import { dropUrl, getAdmin } from "@/app/actionFn/getAllGrpName";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  const [admin,setAdmin] =useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queryClient = useQueryClient();
  const { data, error } = useQuery({
    queryKey: ["get-stream"],
    queryFn: async () => findStream({ groupID: groupID }),
    refetchInterval: 1000, 
      refetchIntervalInBackground: true, 
  });
  


  const seeAdmin = useQuery({
    queryKey:['see-admin',data?.id],
    queryFn:async()=> getAdmin(),
    enabled:!!data?.id
  })
  console.log(seeAdmin.data?.id);
 
  useEffect(()=>{
    if (seeAdmin.data?.id === data?.userId) {
      setAdmin(true)
    }else{
      setAdmin(false)
    }
  },[seeAdmin,data?.userId])


  const dropSong = useMutation({
    mutationKey: ["drop-song"],
    mutationFn: dropUrl,
    onError: () => {
      console.log("nahi hua");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-active-stream"] });
      queryClient.invalidateQueries({ queryKey: ["get-stream"] });
    },
  });

  useEffect(() => {
    const handleSongEnd = () => {
      setCurrentSongIndex((prevIndex) => {
        return prevIndex + 1 < data?.url.length! ? prevIndex + 1 : 0;
      });
    };
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

  const handleDrop = (urlID: string) => {
    dropSong.mutate(urlID);
    console.log(urlID);
  };

  if (error) {
    return <div>Error loading stream</div>;
  }

  if (!data?.url || data.url.length === 0) {
    return (
      <div className="w-full flex items-start justify-between flex-1 max-sm:flex-col ">
        <div className="flex lg:w-3/5 flex-col w-full  p-1  h-96 rounded-lg ">
          <div className="h-full w-full">
            <div className="relative">
              <div className="h-48  w-full  flex flex-col justify-center lg:text-4xl  items-center relative z-20 ">
                <h1 className="text-opacity-15 text-red-700">
                  Please Select your first song
                </h1>
              </div>
              <div className="absolute h-60 w-full top-0 bg-white bg">
                hello
              </div>
              <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-2xl text-center py-1 rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="lg:w-[35%] w-full max-sm:h-40  bg-[#7C3AED] bg-opacity-20 rounded-lg p-2 lg:p-1 flex lg:flex-col items-center gap-2 lg:h-[60vh] overflow-auto songList lg:-mt-10"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-start justify-between flex-1 max-sm:flex-col max-sm:mb-10" >
      <div className="flex lg:w-3/5 flex-col w-full  p-1  h-96 rounded-lg">
        <ActiveSong />
      </div>
      <div className="lg:w-[35%] w-full max-sm:h-40  bg-[#7C3AED] bg-opacity-20 rounded-lg p-2 lg:p-1 flex lg:flex-col items-center gap-2 lg:h-[60vh] overflow-auto songList lg:-mt-10">
        {data.url.length > 0
          ? data.url.map((song: Song, index: number) =>
              index >= data.currentSongIndex ? (
                <div
                  key={index}
                  className={cn(
                    "flex  lg:min-w-full lg:max-w-60 flex-col items-center lg:h-52 p-1 h-36 w-36 bg-[#38196e]  rounded-lg justify-around  relative",
                    index === data.currentSongIndex
                      ? "opacity-75"
                      : "opacity-100"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1.5 right-1 p-1 border bg-red-600 rounded-full z-50 hover:bg-red-900 ",
                      index === data.currentSongIndex ? "hidden" : null,admin === true ?null:'hidden'
                    )}
                    onClick={() => handleDrop(song.id)}
                  >
                    <Minus className="hover:scale-105" />
                  </div>
                  <div className="w-full lg:h-32 h-20">
                    <Image
                      src={song.image}
                      alt={song.title}
                      className="rounded-tr-3xl object-cover lg:object-contain   "
                      fill
                    />
                  </div>
                  <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-lg text-center py-1 rounded-lg whitespace-nowrap overflow-auto title ">
                    <h1>{song.title}</h1>
                  </div>
                </div>
              ) : null
            )
          : null}
      </div>
    </div>
  );
}

export default SongsQueue;

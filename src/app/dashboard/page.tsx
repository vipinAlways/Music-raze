"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { getFavoriteSongs } from "./action";
import Error from "@/components/Error";
import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";

interface Song {
  image_url: string;
  title_url: string;
  Audio_url: string;
}

function Page() {
  const session = useSession();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const userName: string = session?.data?.user?.name ?? "user";
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  const playSong = (index: number) => {
    const currentAudio = audioRefs.current[index];
    if (currentAudio) {
      currentAudio.play();
      setIsPlaying(true);

      currentAudio.onended = () => {
        const nextIndex = index + 1;
        if (nextIndex < audioRefs.current.length) {
          setCurrentSongIndex(nextIndex);
          playSong(nextIndex);
        } else {
          setIsPlaying(false);
        }
      };
    }
  };

  const playAllSongs = () => {
    if (!isPlaying) {
      setCurrentSongIndex(0);
      playSong(0);
    }
  };

  const pauseAllSongs = () => {
    const currentAudio = audioRefs.current[currentSongIndex];
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
  };

  const favortieSong = useQuery<Song[]>({
    queryKey: ["favorite-song"],
    queryFn: async () => getFavoriteSongs(),
  });

  if (favortieSong.error) {
    return <Error />;
  }

  if (!favortieSong.data) {
    return <Error />;
  }

  return (
    <div className="mt-6 flex flex-col text-slate-300 ">
      <div className="flex items-start lg:justify-evenly sm:gap-4 lg:gap-0 text-xl flex-1 px-4 ">
        <div className="leading-6 sm:w-96 sm:h-[60vh] flex flex-col items-start sm:pt-10 gap-10 lg:w-[60%]">
          <div className="text-3xl w-full">
            <h1 className="w-full flex items-end gap-3 lg:text-7xl text-5xl mb-4">
              Hello <span className="text-2xl font-semibold ">@{userName}</span>
            </h1>
            <p>Discover & Create groups where</p>
            <p> you and your friends can have a great time together!</p>
          </div>

          <Button className="p-3 h-fit text-2xl w-64 ml-3">
            <Link href="/dashboard/user-group">YOUR GROUPS</Link>
          </Button>
        </div>

        <div className="h-[55vh] md:w-1/2 lg:w-[30%] bg-white bg-opacity-25 rounded-lg ">
          <h1 className="p-3 w-full text-center bg-white bg-opacity-30 text-purple-800 lg:text-2xl rounded-tr-lg rounded-tl-lg">
            Favorite Song
          </h1>
          <div className="relative mt-1 h-full overflow-auto songlist flex flex-col items-center gap-2 ">
            {favortieSong?.data?.length > 0 ? (
              <>
                {isPlaying ? (
                  <Button onClick={pauseAllSongs} className="absolute top-0 left-0 z-50">
                    <Pause />
                  </Button>
                ) : (
                  <Button onClick={playAllSongs} className="absolute top-0 z-50 left-0">
                    <Play />
                  </Button>
                )}
                {favortieSong.data.map((song, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex lg:min-w-full lg:max-w-60 flex-col items-center h-40 p-1 bg-[#38196e] rounded-lg justify-around relative",
                      currentSongIndex === index ? "opacity-50" : "opacity-100" // Change opacity based on current song
                    )}
                  >
                    <div className="w-full">
                      <img
                        src={song.image_url}
                        alt={song.title_url}
                        className="rounded-tr-3xl object-contain lg:h-24 w-full"
                      />
                    </div>
                    <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-lg text-center py-1 rounded-lg whitespace-nowrap overflow-auto">
                      <h1>{song.title_url}</h1>
                    </div>
                    <audio
                    //@ts-ignore
                      ref={(el) => (audioRefs.current[index] = el as HTMLAudioElement)}
                      src={song.Audio_url}
                    ></audio>
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start pl-12">
        <h1 className="lg:text-4xl text-3xl ">Enrolled Groups</h1>
        <div className="w-full "></div>
      </div>
    </div>
  );
}

export default Page;

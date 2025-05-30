"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { GetCreatedGrp, getFavoriteSongs } from "./action";
import Error from "@/components/Error";
import { cn } from "@/lib/utils";
import { Minus, Pause, Play } from "lucide-react";
import Loader from "@/components/Loader";
import { changeFavList } from "../actionFn/getAllGrpName";
import Image from "next/image";

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
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ["get-user-created-grp"],
    queryFn: async () => GetCreatedGrp(),
  });
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

  const changeFav = useMutation({
    mutationKey: ["change-fav-list"],
    mutationFn: changeFavList,
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-song"] });
    },
  });
  const handleFavList = (Audio_url: string) => {
    changeFav.mutate(Audio_url);
  };

  if (favortieSong.isLoading) {
    return <Loader />;
  }
  if (favortieSong.error || !favortieSong.data) {
    return <Error />;
  }

  return (
    <div className="mt-6 flex flex-col text-slate-300 w-full ">
      <div className="flex items-start max-lg:items-center lg:justify-evenly sm:gap-4 lg:gap-0 text-xl flex-1 lg:px-4 p-2.5 max-lg:flex-col ">
        <div className="leading-6 max-md:sm:w-full sm:h-[60vh] flex flex-col items-start max-lg:items-center sm:pt-10 gap-10 lg:w-[60%]">
          <div className="text-3xl w-full space-y-2 ">
            <h1 className="w-full flex max-md:flex-col items-end gap-3 lg:text-7xl text-6xl mb-4 max-md:items-center">
              Welcome{" "}
              <span className="text-3xl font-semibold ">@{userName}</span>
            </h1>
            <div className="lg:block hidden">
              <p>Discover & Create groups where</p>
              <p> you and your friends can have a great time together!</p>
            </div>
            <div className="lg:hidden block max-md:text-sm w-full text-center">
              <p>Discover & Create groups </p>
              <p> where you and your friends </p>
              <p>can have a great time together!</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button className="lg:p-3 p-2 h-fit  max-md:text-lg lg:text-2xl lg:w-64 ">
              <Link href="/dashboard/user-group">YOUR GROUPS</Link>
            </Button>
            <Button className="lg:p-3 p-2 h-fit lg:text-2xl max-md:text-lg lg:w-64">
              <Link href="/create-group">Create GROUP</Link>
            </Button>
          </div>
        </div>

        <div className="lg:h-[55vh] lg:w-[30%] bg-white bg-opacity-15 rounded-lg  items-center max-md:w-full max-md:mt-5 ">
          <h1 className="p-3 w-full lg:text-center bg-white bg-opacity-60 text-purple-900 lg:text-2xl rounded-tr-lg rounded-tl-lg max-md:text-lg ">
            Favorite Song
          </h1>
          <div className="max-lg:hidden relative mt-1 h-[50vh] overflow-auto songlist flex flex-col items-center gap-2 title">
            {favortieSong?.data?.length > 0 ? (
              <>
                {isPlaying ? (
                  <Button
                    onClick={pauseAllSongs}
                    className="absolute top-0 left-0 z-50"
                  >
                    <Pause />
                  </Button>
                ) : (
                  <Button
                    onClick={playAllSongs}
                    className="absolute top-0 z-50 left-0"
                  >
                    <Play />
                  </Button>
                )}
                {favortieSong.data.map((song, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex lg:min-w-full lg:max-w-60 flex-col items-center h-40 p-1 bg-[#38196e] rounded-lg justify-around relative",
                      currentSongIndex === index ? "opacity-50" : "opacity-100"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-1.5 right-1 p-1 border bg-red-600 rounded-full z-50 hover:bg-red-900 "
                      )}
                      onClick={() => handleFavList(song.Audio_url)}
                    >
                      <Minus className="hover:scale-105" />
                    </div>
                    <div className="w-full">
                      <Image
                        src={song.image_url}
                        alt={song.title_url}
                        className="rounded-tr-3xl object-contain lg:h-24 w-full"
                        height={176}
                        width={176}
                      />
                    </div>
                    <div className="bg-[#7C3AED] title h-10 text-slate-300 w-full text-lg text-center py-1 rounded-lg whitespace-nowrap overflow-x-auto overflow-y-hidden">
                      <h1>{song.title_url}</h1>
                    </div>
                    <audio
                      ref={(el) => {
                        audioRefs.current[index] = el as HTMLAudioElement;
                      }}
                      src={song.Audio_url}
                    ></audio>
                  </div>
                ))}
              </>
            ) : null}
          </div>
          <div className="max-lg:flex  relative lg:h-[50vh] max-md:h-32 overflow-auto songlist lg:hidden lg:flex-col items-center gap-2 title">
            {favortieSong?.data?.length > 0 ? (
              <>
                {isPlaying ? (
                  <Button
                    onClick={pauseAllSongs}
                    className="sticky left-0 z-50"
                  >
                    <Pause />
                  </Button>
                ) : (
                  <Button
                    onClick={playAllSongs}
                    className="sticky top-0 z-50 left-0"
                  >
                    <Play />
                  </Button>
                )}
                {favortieSong.data.map((song, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex lg:min-w-full lg:max-w-60 w-full flex-col items-center lg:h-40  max-lg:h-28 px-1 bg-[#38196e] rounded-lg justify-around relative",
                      currentSongIndex === index ? "opacity-50" : "opacity-100"
                    )}
                  >
                    <div className="h-24 relative w-full  min-w-20">
                      <Image
                        src={song.image_url}
                        alt={song.title_url}
                        className="rounded-tr-3xl object-cover "
                        fill
                      />
                    </div>
                    <audio
                      ref={(el: HTMLAudioElement | null) => {
                        if (el) audioRefs.current[index] = el;
                      }}
                      src={song.Audio_url}
                    />
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start pl-12">
        <h1 className="lg:text-4xl text-3xl ">Enrolled Groups</h1>
        <div className="w-full ">
          {data?.addedOne &&
            data?.addedOne.map((group) => (
              <div>
                <h1>{group.groupName}</h1>
                <p>{group.description}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Page;

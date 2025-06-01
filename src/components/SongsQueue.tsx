"use client";
import { findStream } from "@/app/group/[groupID]/action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";

import { Minus } from "lucide-react";
import ActiveSong, { ActiveSongProps } from "./ActiveSong";
import { dropUrl, getAdmin } from "@/app/actionFn/getAllGrpName";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

interface Song {
  id: string;
  streamId: string;
  url: string;
  image: string;
  title: string;
}

function SongsQueue({ groupID }: { groupID: string }) {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [admin, setAdmin] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queryClient = useQueryClient();
  const { data, error } = useQuery({
    queryKey: ["get-songs", groupID],
    queryFn: async () => findStream({ groupID: groupID }),
  });

  const seeAdmin = useQuery({
    queryKey: ["see-admin", data?.id],
    queryFn: async () => getAdmin(),
    enabled: !!data?.id,
  });

  useEffect(() => {
    if (seeAdmin.data?.id === data?.userId) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [seeAdmin, data?.userId]);

  useEffect(() => {
    const channel = pusherClient.subscribe("add-song");

    const handleNewSong = (updated: any) => {
      if (updated) {
        console.log("Pusher update received in SongsQueue:", updated);
        queryClient.invalidateQueries({ queryKey: ["get-songs", groupID] });
      } else {
        console.log("Pusher ignored: groupID doesn't match");
        console.log(updated, "nahi hain kya ");
      }
    };

    channel.bind("new-song-add", handleNewSong);

    return () => {
      channel.unbind("new-song-add", handleNewSong);
      pusherClient.unsubscribe("add-song");
    };
  }, [groupID, queryClient]);

  useEffect(() => {
    const channel = pusherClient.subscribe("active-song");

    channel.bind("new-activeSong", (updated: ActiveSongProps) => {
      if (updated) {
        queryClient.invalidateQueries({
          queryKey: ["get-active-stream", groupID],
        });
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("active-song");
    };
  }, [groupID, queryClient]);

  const dropSong = useMutation({
    mutationKey: ["drop-song"],
    mutationFn: dropUrl,
    onError: () => {
      console.log("nahi hua");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-stream"] });
      queryClient.invalidateQueries({ queryKey: ["get-active-stream"] });
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

  useEffect(() => {
    const channel = pusherClient.subscribe("end-stream");
    channel.bind("new-endStream", (updated: ActiveSongProps) => {
      if (updated) {
        queryClient.invalidateQueries({
          queryKey: ["group-data", groupID],
        });
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("end-stream");
    };
  }, [queryClient,handleDrop,groupID]);
  useEffect(() => {
    const channel = pusherClient.subscribe("drop-song");

    channel.bind("new-song-remove", (updated: any) => {
      if (updated) {
        queryClient.invalidateQueries({ queryKey: ["get-songs"] });
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("drop-song");
    };
  }, [groupID, queryClient]);

  if (error) {
    return <div>Error loading stream</div>;
  }

  return (
    <div className="w-full flex items-start justify-between flex-1 max-sm:flex-col max-sm:mb-10">
      <div className="flex lg:w-full flex-col w-full  p-1 rounded-lg">
        <ActiveSong groupID={groupID} isAdmin={admin} />
      </div>
      {data && data.url.length > 0 ? (
        <div className="lg:w-[35%] w-full max-sm:h-40 bg-[#7C3AED] bg-opacity-20 rounded-lg p-2 lg:p-1 flex lg:flex-col items-center gap-2 lg:h-[60vh] overflow-auto songList lg:-mt-10">
          {data.url.map((song: Song, index: number) =>
            index >= data.currentSongIndex ? (
              <div
                key={index}
                className={cn(
                  "flex lg:min-w-full lg:max-w-60 flex-col items-center lg:h-60 p-1 h-36 w-36 bg-[#38196e] rounded-lg justify-around relative",
                  index === data.currentSongIndex ? "opacity-75" : "opacity-100"
                )}
              >
                <div
                  className={cn(
                    "absolute top-1.5 right-1 p-1 border bg-red-600 rounded-full z-50 hover:bg-red-900",
                    index === data.currentSongIndex ? "hidden" : "",
                    admin === true ? "" : "hidden"
                  )}
                  onClick={() => handleDrop(song.id)}
                >
                  <Minus className="hover:scale-105" />
                </div>
                <div className="lg:h-40 h-20 w-full relative">
                  <Image
                    src={song.image}
                    alt={song.title}
                    className="object-contain object-center"
                    fill
                  />
                </div>
                <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-lg text-center py-1 rounded-lg whitespace-nowrap overflow-x-auto overflow-y-hidden">
                  <h1 className="title">{song.title}</h1>
                </div>
              </div>
            ) : null
          )}
        </div>
      ) : null}
    </div>
  );
}

export default SongsQueue;

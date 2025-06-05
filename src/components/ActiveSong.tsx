import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import {
  addFavorite,
  deleteStream,
  findActiveStream,
  getAdmin,
  getUser,
  updateActiveStream,
} from "@/app/actionFn/getAllGrpName";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

export interface ActiveSongProps {
  isAdmin: boolean;
  groupID: string;
}
export default function ActiveSong({ isAdmin, groupID }: ActiveSongProps) {
  const { toast } = useToast();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queryClient = useQueryClient();
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [countDown, setCountDown] = useState<number>(0);
  const [hidden, setHidden] = useState<string>("hidden");
  const [hidden2, setHidden2] = useState<string>("");
  const [admin, setAdmin] = useState<boolean>(false);

  const { data } = useQuery({
    queryKey: ["get-active-stream"],
    queryFn: async () => findActiveStream(groupID),
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
    setTimeout(() => {
      setCurrentSongIndex(data?.currentSongIndex || 0);
    }, 150);
  });

  const updateStreamMutation = useMutation({
    mutationKey: ["update"],
    mutationFn: async (newSongIndex: number) =>
      updateActiveStream(groupID, newSongIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-active-stream"] });
      queryClient.invalidateQueries({ queryKey: ["get-stream"] });
      pusherClient.subscribe("active-song");
    },
  });

  useEffect(() => {
    const handleSongEnd = () => {
      if (currentSongIndex < data?.url.length! - 1) {
        const nextIndex = (currentSongIndex + 1) % data?.url.length!;
        updateStreamMutation.mutate(nextIndex);
      } else {
        updateStreamMutation.mutate(data?.url.length! - 1);
      }
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
  }, [currentSongIndex, data?.url.length, updateStreamMutation]);

  const deleteS = useMutation({
    mutationKey: ["delete-stream"],
    mutationFn: deleteStream,
    onError: () =>
      toast({
        title: "Error",
        description: "Not able to end Stream please try again later",
        variant: "destructive",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-active-stream"] });
      queryClient.invalidateQueries({ queryKey: ["get-stream"] });
      queryClient.invalidateQueries({ queryKey: ["group-data"] });
      pusherClient.unsubscribe("end-stream");
    },
  });

  const endStream = () => {
    setHidden("");
    setCountDown(0);
    setHidden2("hidden");
    setTimeout(() => {
      deleteS.mutate(data?.id ?? "");
    }, 5000);
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
  }, [queryClient,groupID]);
  
  useEffect(() => {
    const channel = pusherClient.subscribe("active-song");

    channel.bind("new-activeSong", (updated: ActiveSongProps) => {
      if (updated) {

        queryClient.invalidateQueries({
         queryKey: ["group-data", groupID],
        });
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("active-song");
    };
  }, [groupID, queryClient]);
  

  useEffect(() => {
    if (countDown < 5) {
      const timer = setTimeout(() => {
        setCountDown((prev) => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countDown]);

  const favorite = useMutation({
    mutationKey: ["add-favorite"],
    mutationFn: addFavorite,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Greate",
        description: "added it to favorites",
      });
    },
  });

  const addFavoriteSongs = (
    songImage: string,
    songTitle: string,
    songPreview: string
  ) => {
    favorite.mutate({
      image_url: songImage,
      Audio_url: songPreview,
      title_url: songTitle,
    });
  };

  if (!data?.url || data.url.length === 0) {
    return (
      <div className="w-full flex items-start justify-between flex-1 max-sm:flex-col ">
        <div className="flex lg:w-3/5 flex-col w-full  p-1  h-96 rounded-lg ">
          <div className=" w-full">
            <div className="relative flex flex-col items-center gap-10">
              <div className="h-48  w-full  flex flex-col justify-center lg:text-4xl  items-center relative z-20 ">
                <h1 className="text-opacity-15 text-red-700">
                  Please Select your first song
                </h1>
              </div>
              <div className="absolute h-60 w-full top-0 bg-white bg"></div>
              <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-2xl text-center py-1 rounded-lg"></div>
            </div>
          </div>
          <div
            className={cn(
              "text-center w-full mt-3  lg:text-2xl flex items-center justify-center flex-col gap-3 ",
              admin ? "" : ""
            )}
          >
            <Button
              onClick={() => endStream()}
              className={cn(
                "bg-[#5b1dc5] lg:text-2xl p-2",
                admin === true ? "" : "hidden",
                hidden2
              )}
            >
              End Stream
            </Button>

            <div
              className={`z-30 bg-[#5b1dc5] h-28 w-28 rounded-full text-slate-200   ${hidden}   `}
            >
              <div className="h-full rounded-full w-full  lg:text-4xl flex items-center justify-center top-12 ">
                {countDown}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[35%] w-full max-sm:h-40  bg-[#7C3AED] bg-opacity-20 rounded-lg p-2 lg:p-1 flex lg:flex-col items-center gap-2 lg:h-[60vh] overflow-auto songList lg:-mt-10"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit">
      {data?.url[currentSongIndex] ? (
        <div className="relative flex flex-col items-center gap-10 h-fit">
          <div className="h-full w-full rounded-lg flex flex-col items-center relative z-20 ">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-64 lg:h-64">
              <Image
                src={data.url[currentSongIndex].image || ""}
                alt={data.url[currentSongIndex].title || ""}
                className="object-cover lg:object-contain"
                fill
                sizes="(max-width: 640px) 176px, (max-width: 1024px) 256px, 176px"
              />
            </div>

            <audio
              ref={audioRef}
              src={data.url[currentSongIndex].url}
              controls
              className={cn("p-2 w-full")}
              autoPlay
            />
          </div>
          <div className="absolute h-60 w-full top-0 rounded-lg bg">
            <div className="relative h-full w-full">
              <Image
                src={data.url[currentSongIndex].image || ""}
                alt={data.url[currentSongIndex].title || ""}
                className="object-cover -z-10 h-full w-full rounded-md"
                fill
              />
            </div>
          </div>

          <div
            className="absolute top-0 right-2 group z-30"
            onClick={() =>
              addFavoriteSongs(
                data.url[currentSongIndex].image,
                data.url[currentSongIndex].title,
                data.url[currentSongIndex].url
              )
            }
          >
            <button className="text-red-700 text-3xl p-2 rounded-full px-4 bg-slate-300">
              &#9829;
            </button>
            <h1 className="absolute -top-6 w-fit whitespace-nowrap -right-4 text-xs hidden group-hover:block group-hover:transition group-hover:ease-out group-hover:duration p-1 bg-red-400 rounded-lg text-slate-200">
              Add Favorite
            </h1>
          </div>

          <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-2xl text-center py-1 rounded-lg title whitespace-nowrap overflow-auto">
            {data.url[currentSongIndex].title}
          </div>
          <h1 className="text-slate-200 text-center text-2xl mt-2 playing">
            {hidden === "hidden"
              ? " Playing 🎵🎵🎵🎵 "
              : " Stream Is Going TO be Ended"}
          </h1>

          <div
            className={cn(
              "text-center w-full  lg:text-2xl relative",
              admin ? "" : ""
            )}
          >
            <Button
              onClick={() => endStream()}
              className={cn(
                "bg-[#5b1dc5] lg:text-2xl p-2",
                admin === true ? "" : "hidden",
                hidden2
              )}
            >
              End Stream
            </Button>

            <div
              className={`z-30 bg-[#5b1dc5] absolute -top-12 left-1/2 -translate-x-1/2 rounded-full text-slate-200 ${hidden}  `}
            >
              <div className="h-28 rounded-full w-28  lg:text-4xl flex items-center justify-center top-12 ">
                {countDown}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

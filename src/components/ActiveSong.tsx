import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useGroup } from "./GroupContextType ";
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

export default function ActiveSong({ isAdmin }: { isAdmin: boolean }) {
  const { toast } = useToast();
  const { groupID } = useGroup();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queryClient = useQueryClient();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const [hidden, setHidden] = useState("hidden");
  const [hidden2, setHidden2] = useState("");
  const [admin, setAdmin] = useState(false);

  const { data } = useQuery({
    queryKey: ["get-active-stream"],
    queryFn: async () => findActiveStream(groupID),
    // refetchInterval: 1000,
    // refetchIntervalInBackground: true,
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
    },
  });
  useEffect(() => {
    const channel = pusherClient.subscribe("active-song");

    channel.bind("new-activeSong", (updated: any) => {
      if (updated.groupId === groupID) {
        queryClient.setQueryData(["get-active-stream", groupID], updated);
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("active-song");
    };
  }, [groupID, queryClient]);

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
    },
  });

  const endStream = () => {
    setHidden("");
    setCountDown(0);
    setHidden2("hidden");
    setTimeout(() => {
      deleteS.mutate(data?.id ?? "");
    }, 5000);

    queryClient.invalidateQueries({ queryKey: ["get-active-stream"] });
  };
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

  
 
  return (
    <div className="h-full w-full">

      <h1>{data?.currentSongIndex}</h1>
      {data?.url[currentSongIndex] ? (
        <div className="relative">
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
              autoPlay={true}
            />
          </div>
          <div className="absolute h-60 w-full top-0 rounded-lg bg">
            <Image
              src={data.url[currentSongIndex].image || ""}
              alt={data.url[currentSongIndex].title || ""}
              className="object-cover -z-10 h-full w-full rounded-md"
              height={176}
              width={160}
            />
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
              "text-center w-full mt-3  lg:text-2xl relative",
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

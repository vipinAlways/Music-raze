import { checkAdmin, createStream } from "@/app/actionFn/getAllGrpName";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher";
import { ActiveSongProps } from "./ActiveSong";

function StartStream({ grpid }: { grpid: string }) {
  const { toast } = useToast();
  const [countDown, setCountDown] = useState(0);
  const queryClient = useQueryClient();
  const [hidden, setHidden] = useState("hidden");
  const [admin, setAdmin] = useState(false);
  const [hidden2, setHidden2] = useState("");

  const { mutate } = useMutation({
    mutationKey: ["createStream"],
    mutationFn: createStream,
    onError: (error) =>
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      }),
    onSuccess: () =>
      toast({
        title: "Stream started",
        description: "Stream started successfully",
      }),
  });

  useEffect(() => {
    const channel = pusherClient.subscribe("active-stream");

    channel.bind("new-stream", (updated: ActiveSongProps) => {
      if (updated.groupID === grpid) {
        console.log("Updated active song:", updated);
        queryClient.setQueryData(["get-active-stream", grpid], updated);
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("active-stream");
    };
  }, [grpid, queryClient]);

  const handleSubmit = (e: React.FormEvent) => {
    setHidden("");
    setHidden2("hidden");
    setCountDown(0);
    e.preventDefault();
    mutate({ groupId: grpid });
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  useEffect(() => {
    if (countDown < 5) {
      const timer = setTimeout(() => {
        setCountDown((prev) => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countDown]);

  const group = useQuery({
    queryKey: ["check-admin", grpid],
    queryFn: async () => await checkAdmin(grpid),
    enabled: !!grpid,
    staleTime: 0,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["check-admin", grpid] });
  }, [grpid, queryClient]);

  useEffect(() => {
    if (group.isSuccess && group.data?.success === true) {
      setAdmin(true);
    } else if (group.isError || group.data?.success === false) {
      setAdmin(false);
    }
  }, [group.isSuccess, group.isError, group.data]);

  return (
    <div className="relative w-full text-center">
      <h1
        className={`w-full text-center lg:text-3xl text-slate-200 ${hidden2}`}
      >
        Currently no stream
      </h1>
      <Button
        onClick={handleSubmit}
        className={cn("mt-4", admin === true ? "" : "hidden")}
      >
        Start Stream
      </Button>

      <div
        className={`z-30 bg-[#5b1dc5] absolute top-0 left-1/2 -translate-x-1/2 rounded-full text-slate-200 ${hidden}`}
      >
        <div className="h-72 rounded-full w-72 lg:text-7xl flex items-center justify-center">
          {countDown}
        </div>
      </div>
    </div>
  );
}

export default StartStream;

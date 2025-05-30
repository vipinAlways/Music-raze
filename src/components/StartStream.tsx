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

  const handleSubmit = (e: React.FormEvent) => {
    setHidden("");
    setHidden2("hidden");
    e.preventDefault();
    mutate({ groupId: grpid });
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["get-active-stream", grpid] });
      queryClient.invalidateQueries({ queryKey: ["group-data", grpid] });
    }, 5000);
  };

  useEffect(() => {
    const channel = pusherClient.subscribe("active-song");

    channel.bind("new-activeSong", (updated: ActiveSongProps) => {
      if (updated) {
        console.log(updated);
        queryClient.invalidateQueries({
          queryKey: ["get-active-stream", grpid],
        });
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("active-song");
    };
  }, [grpid, queryClient]);

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
    </div>
  );
}

export default StartStream;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useGroup } from "./GroupContextType ";
import { findActiveStream, updateActiveStream } from "@/app/actionFn/getAllGrpName";

export default function ActiveSong() {
    const { groupID } = useGroup();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const queryClient = useQueryClient()
    // Fetch the current active stream for the group
    const { data, error } = useQuery({
      queryKey: ['get-active-stream'],
      queryFn: async () => findActiveStream(groupID),
    });
  
    const currentSongIndex = data?.currentSongIndex || 0; // Default to 0 if no index is available
  
    // Mutation to update the active song on the server
    const updateStreamMutation = useMutation({
        mutationKey:['update'],
      mutationFn: async (newSongIndex: number) => updateActiveStream(groupID, newSongIndex),
      onSuccess:()=>{
        queryClient.invalidateQueries({ queryKey: ['get-active-stream'] })
        console.log("URL added successfully");
      }
    });
  
    const handleSongEnd = () => {
      const nextIndex = (currentSongIndex + 1) % data?.url.length!;
      updateStreamMutation.mutate(nextIndex);
  
     
    };
  
    useEffect(() => {
      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.addEventListener('ended', handleSongEnd);
      }
  
      return () => {
        if (audioElement) {
          audioElement.removeEventListener('ended', handleSongEnd);
        }
      };
    }, [currentSongIndex, data?.url.length]);
  
    return (
      <div>
        {data?.url[currentSongIndex] ? (
          <div>
            <div className="h-60 w-full bg-slate-200 rounded-lg flex flex-col items-center relative">
              <img
                src={data.url[currentSongIndex].image || ''}
                alt={data.url[currentSongIndex].title || ''}
                className="h-48 p-2 w-full object-cover"
              />
              <audio
                ref={audioRef}
                src={data.url[currentSongIndex].url}
                controls
                className="p-2 w-full"
                autoPlay={true}
              />
            </div>
            <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-2xl text-center py-1 rounded-lg title whitespace-nowrap overflow-auto">
              {data.url[currentSongIndex].title}
            </div>
            <h1 className="text-slate-200 text-center">Current Song</h1>
          </div>
        ) : null}
      </div>
    );
  }
  
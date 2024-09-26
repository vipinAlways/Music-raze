import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useGroup } from "./GroupContextType ";
import {
  deleteStream,
  findActiveStream,
  updateActiveStream,
} from "@/app/actionFn/getAllGrpName";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";


export default function ActiveSong() {
  const {toast} =useToast()
  const { groupID } = useGroup();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queryClient = useQueryClient();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [countDown,setCountDown] =useState(0)
    const [hidden,setHidden] =useState('hidden')
    const [hidden2,setHidden2] =useState('')
  const { data, error } = useQuery({
    queryKey: ["get-active-stream"],
    queryFn: async () => findActiveStream(groupID),
  });



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

  const handleSongEnd = () => {

    if (currentSongIndex < data?.url.length! - 1) {
      const nextIndex = (currentSongIndex + 1) % data?.url.length!;
      updateStreamMutation.mutate(nextIndex);
      
    }
    else{
      updateStreamMutation.mutate(data?.url.length! -1);
    }

  };

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

  const deleteS = useMutation({
    mutationKey:['delete-stream'],
    mutationFn:deleteStream,
    onError:()=>toast({
      title:"Error",
      description:'Not able to end Stream please try again later',
      variant:'destructive'
    }),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["get-active-stream"] });
      queryClient.invalidateQueries({ queryKey: ["get-stream"] });
      queryClient.invalidateQueries({ queryKey: ["group-data"] });
    }
  })

  const endStream = ()=>{
      setHidden('')
      setCountDown(0)
      setHidden2('hidden')
      setTimeout(() => {
        deleteS.mutate(data?.id ?? '')
      }, 5000);
    
  }
  useEffect(() => {
    if (countDown < 5) {
      const timer = setTimeout(() => {
        setCountDown((prev) => prev + 1);
      }, 1000);
      
    
      return () => clearTimeout(timer);
    }
  }, [countDown]);

  return (
    <div className="h-full w-full">
      {data?.url[currentSongIndex] ? (
        <div className="relative">
          <div className="h-full w-full rounded-lg flex flex-col items-center relative z-20 ">
            <img
              src={data.url[currentSongIndex].image || ""}
              alt={data.url[currentSongIndex].title || ""}
              className="h-48 p-2 w-full object-contain"
            />
            <audio
              ref={audioRef}
              src={data.url[currentSongIndex].url}
              controls={true}
              className="p-2 w-full"
              autoPlay={true}
            />
          </div>
          <div className="absolute h-60 w-full top-0 rounded-lg bg">
            <img
              src={data.url[currentSongIndex].image || ""}
              alt={data.url[currentSongIndex].title || ""}
              className="object-cover -z-10 h-full w-full rounded-lg"
            />
          </div>
          <div className="bg-[#7C3AED] h-10 text-slate-300 w-full text-2xl text-center py-1 rounded-lg title whitespace-nowrap overflow-auto">
            {data.url[currentSongIndex].title}
          </div>
          <h1 className="text-slate-200 text-center text-2xl mt-2 playing">
           {
            hidden === 'hidden' ? ' Playing 🎵🎵🎵🎵 ' : ' Stream Is Going TO be Ended'
           }
          </h1>


          <div className={cn("text-center w-full mt-3  lg:text-2xl relative")}>
            <Button onClick={()=>endStream()} className={cn('bg-[#5b1dc5] lg:text-2xl p-2')} >
                  End Stream
            </Button>

            <div className={`z-30 bg-[#5b1dc5] absolute -top-11  left-10 rounded-full text-slate-200 ${hidden} `}>
            <div className='h-28 rounded-full w-28  lg:text-4xl flex items-center justify-center'>
                {
                  countDown
                }
            </div>
          </div>
          </div>
        </div>

      ) : null}
    </div>
  );
}

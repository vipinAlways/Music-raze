"use client";
import React, { useState, useEffect, useContext } from "react";
import { MusicContext } from "./Context";
import { cn } from "@/lib/utils";
import VolumeRange from "./VolumeRange";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUrl } from "@/app/actionFn/getAllGrpName";
import { useToast } from "@/hooks/use-toast";

function SearchSong({ currentgrpId }: { currentgrpId: string }) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [albums, setAlbums] = useState<any[]>([]);
  const [debounceSreachInput, setDebouncedSearchInput] = useState<string>("");
  const [globalVolume, setGlobalVolume] = useState<number>(1);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const queryClient = useQueryClient()
  const {toast} =useToast()

  const musicContext = useContext(MusicContext);
  const resultOffset = musicContext?.resultOffset;


  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchInput("");
      }
    };

    window.document.addEventListener("keydown", handleKeydown);

    return () => {
      window.document.removeEventListener("keydown", handleKeydown);
    };
  }, [searchInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const getToken = async () => {
      const authParameters = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=fe28da8034844fa691564352578fb783&client_secret=3b6ef9f6e84042c2ad4af782681dd34c`,
      };

      try {
        const response = await fetch(
          "https://accounts.spotify.com/api/token",
          authParameters
        );
        const data = await response.json();
        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    if (searchInput === "") {
      setAlbums([]);
    }
  }, [searchInput]);

  useEffect(() => {
    const getTrack = async () => {
      if (debounceSreachInput && accessToken) {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${debounceSreachInput}&type=track&offset=${resultOffset}&limit=12`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const tracks = await response.json();
        setAlbums(tracks.tracks?.items || []);
      }
    };
    getTrack();
  }, [debounceSreachInput, accessToken, resultOffset]);

  const { mutate } = useMutation({
    mutationKey: ["add-url"],
    mutationFn: addUrl,
    onError: (error) => {
      toast({
        title:"Error",
        description:error.message ?? 'error while adding',
        variant:'destructive'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-stream'] })
      console.log("URL added successfully");
    },
  });

  const handleUrl = (songImage:string, songTitle: string, songPreview: string) => {
    mutate({ image: songImage, title: songTitle, link: songPreview, groupId: currentgrpId.toString() })
  };

  return (
    <div className="flex items-start justify-end">
      <div className="w-2/5 mx-auto absolute top-2/5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <input
          type="text"
          name="songName"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a song..."
          className="w-full h-12 rounded-lg px-4 py-1.5 text-xl lg:text-2xl border-2 outline-none font-serif"
        />

        <div
          className={cn(
            searchInput === "" && albums.length === 0
              ? "hidden"
              : "w-full border-4 border-b-0 border-[#7C3AED] bg-[#7C3AED] bg-opacity-80 p-1 grid grid-cols-1 lg:grid-cols-3 gap-2 items-stretch justify-center overflow-auto h-[70vh] dropdown rounded-md z-[9999]"
          )}
        >
          {albums.length > 0 ? (
            albums.map((song, index) =>
              song.preview_url ? (
                <div
                  key={index}
                  className="w-full h-64 justify-around flex flex-col items-center border-slate-300 border p-2 rounded-lg relative"
                >
                  <div className="h-40 w-full">
                    {song.album.images[0]?.url ? (
                      <img
                        src={song.album.images[0].url}
                        alt="track img"
                        className="object-contain h-full w-full"
                      />
                    ) : (
                      <img
                        src=""
                        alt="no track"
                        className="object-contain h-full w-full"
                      />
                    )}
                  </div>
                  <p className="text-sm text-center whitespace-nowrap overflow-auto w-full songName">
                    {song.name} by{" "}
                    {song.artists.map((artist: any) => artist.name).join(", ")}
                  </p>
                  <div
                    className="text-center flex flex-col justify-center bg-zinc-600 text-white items-center absolute top-2 right-[1%] -translate-x-[10%] border rounded-full h-8 w-8"
                      onClick={() => {
                        if (!song.album.images[0]?.url || !song.name || !song.preview_url) {
                          toast({
                            title:"Error",
                            description:"can't able to add this song"
                          })
                        }
                      handleUrl(song.album.images[0]?.url, song.name, song.preview_url),
                      setSearchInput("")
                      }}
                  >
                    <Plus />
                  </div>
                </div>
              ) : null
            )
          ) : (
            <div
              className={cn(
                searchInput === "" && albums.length === 0
                  ? "hidden"
                  : "w-full text-center text-xl font-bold"
              )}
            >
              No songs found
            </div>
          )}
        </div>
      </div>
      <VolumeRange
        setCurrentAudio={setCurrentAudio}
        setGlobalVolume={setGlobalVolume}
        currentAudio={currentAudio}
        globalVolume={globalVolume}
      />
    </div>
  );
}

export default SearchSong;

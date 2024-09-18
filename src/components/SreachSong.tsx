"use client";
import React, { useState, useEffect, useContext } from "react";
import { MusicContext } from "./Context";
import { cn } from "@/lib/utils";
import VolumeRange from "./VolumeRange";

function SreachSong() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  // const [clickEvent, setclickEvent] = useState<string>("");
  const [albums, setAlbums] = useState<any[]>([]);
  const [debounceSreachInput, setDebouncedSearchInput] = useState<string>("");
  const [globalVolume, setGlobalVolume] = useState<number>(0.2);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const musicContext = useContext(MusicContext);
  const resultOffset = musicContext?.resultOffset;

  const handlePlay = (audioElement: HTMLAudioElement) => {
    if (currentAudio && currentAudio !== audioElement) {
      currentAudio.pause();
    }
    audioElement.volume = globalVolume;
    setCurrentAudio(audioElement);
  };
  

useEffect(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
     
      setSearchInput('');
      
    }
  };

  // Add event listener for 'keydown'
  window.document.addEventListener('keydown', handleKeydown);

  // Cleanup function to remove the event listener when the component unmounts
  return () => {
    window.document.removeEventListener('keydown', handleKeydown);
  };
}, [searchInput]);

  
  useEffect(() => {
    setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 500);
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
      if (searchInput && accessToken) {
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

  return (
    <div className="flex items-start  justify-end">
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
              : "w-full border-4 border-b-0 border-[#7C3AED] bg-[#7C3AED] bg-opacity-80 p-1 grid grid-cols-1 lg:grid-cols-3 gap-2 items-stretch justify-center overflow-auto h-[70vh] dropdown rounded-md"
          )}
        >
          {albums.length > 0 ? (
            albums.map((song, index) =>
              song.preview_url ? (
                <div
                  key={index}
                  className="w-full h-64 justify-around flex flex-col items-center border-slate-300 border p-2 rounded-lg"
                >
                  <div className="h-40 w-full">
                    {song.album.images[0].url ? (
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
                  <div className="w-full flex flex-col items-center gap-2">
                    <audio
                      controls
                      src={song?.preview_url}
                      className="w-full h-10"
                      onPlay={(e) => handlePlay(e.currentTarget)}
                    ></audio>
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

export default SreachSong;

import React, { useState } from "react";
import { Input } from "./ui/input";
import { fetchSpotifyProfile } from "@/app/actionFn/getAllGrpName";
import { useQuery } from "@tanstack/react-query";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
}


interface Results {
  spotify: SpotifyTrack[];

}

function SreachSong() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results>({
    spotify: [],
   
  });
  const handleSearch = async () => {
    const spotifyResponse = await fetch(`/api/spotify?query=${query}`);
    const spotifyData = await spotifyResponse.json();

    const youtubeResponse = await fetch(`/api/youtube?query=${query}`);
    const youtubeData = await youtubeResponse.json();

    setResults({ spotify: spotifyData });
  };
  const [params, setParams] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["spotifyProfile"],
    queryFn: async () => fetchSpotifyProfile(query),
  });

  console.log(data);
  return (
    <div>
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for songs"
    />
    <button onClick={handleSearch}>Search</button>

    <div>
      <h2>Spotify Results</h2>
      {results.spotify.map((track) => (
        <div key={track.id}>
          {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
        </div>
      ))}

      <h2>YouTube Results</h2>
      {/* {results.youtube.map((video) => (
        <div key={video.id.videoId}>
          <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
            {video.snippet.title}
          </a>
        </div>
      ))} */}
    </div>
  </div>
  );
}

export default SreachSong;

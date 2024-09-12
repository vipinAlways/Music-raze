// import { NextApiRequest, NextApiResponse } from "next";
// import SpotifyWebApi from "spotify-web-api-node";

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.SPOTIFY_CLIENT_ID!,
//   clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
// //   redirectUri: process.env.SPOTIFY_REDIRECT_URI!,
// });

// spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN!);

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const data = await spotifyApi.getMe();

//     res.status(200).json(data.body);
//   } catch (error) {
//     console.error("Error fetching data from Spotify:", error);
//     res.status(500).json({ error: "Failed to fetch data from Spotify" });
//   }
// }
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

async function getSpotifyAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const accessToken = await getSpotifyAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query as string)}&type=track`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    res.status(200).json(data.tracks.items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Spotify' });
  }
}

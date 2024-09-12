"use server";

import { db } from "@/lib/db";

export async function getAllGrpNames() {
  return await db.group.findMany({});
}

export async function getGroup(id: string) {
  return await db.group.findFirst({
    where: {
      id: id,
    },
  });
}
interface SpotifyTrack {
   id: string;
   name: string;
   artists: { name: string }[];
 }

 export async function fetchSpotifyProfile(query: string): Promise<SpotifyTrack[]> {
   const response = await fetch(`/api/spotify?query=${query}`);
   if (!response.ok) {
     throw new Error('Network response was not ok');
   }
   const data = await response.json();
   return data; // Ensure this matches the expected format
 }

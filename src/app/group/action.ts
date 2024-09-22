
'use server'
import { db } from "@/lib/db";

export async function findStream({ streamId }: { streamId: string }) {
  try {
    return await db.activeStreams.findUnique({
      where: {
        id: streamId,
      },
      include: {
        url: true,
      },
    });

    
  } catch (error) {
    console.log(error);
    throw new Error("Could not find any stream for the given group");
  }
}

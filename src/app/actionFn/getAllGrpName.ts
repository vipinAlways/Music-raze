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
    include:{
      ActiveStreams:true
    }
  });
}
export async function getUser(id: string) {
  return await db.user.findFirst({
    where: {
      id: id,
    },
  });
}
export async function getMembers(member: string[]) {
  if (member.length === 0) {
    throw new Error('it do not have any member')
  }
  return await db.user.findMany({
    where: {
      id: {
        in:member
      },
    },
  });
}



export async function createStream({ groupId }: { groupId: string }) {
  try {
    // Find the group by ID
    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new Error("Unable to find group");
    }

    // Create the stream associated with the group
    const createdStream = await db.activeStreams.create({
      data: {
        groupId: groupId,
        type: "Spotify", 
        userId: group.userId,
      },
    });

    // Update the group's streamId with the createdStream ID
    await db.group.update({
      where: { id: groupId },
      data: { streamId: createdStream.id },
    });

    return createdStream;
    
  } catch (error) {
    console.error("Error creating stream:", error);
    throw error;
  }
}


interface urlTypes{
  groupId:string
  link:string
  image:string
  title:string
}



export async function addUrl({ image, title, groupId, link }: urlTypes) {
  try {

    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new Error("Unable to find group");
    }

    
    const stream = await db.activeStreams.findUnique({
      where: {
        groupId: groupId,
      },
    });

    if (!stream) {
      throw new Error("Unable to find stream");
    }

    if (!image || !title || !link) {
      throw new Error('not able to add this song')
    }
    const newUrl = await db.url.create({
      data: {
        image,
        title,
        streamId: stream.id,
        url: link,
      },
    });

    return newUrl;

  } catch (error) {
    console.error("Error adding URL:", error);
    throw error; 
  }
}

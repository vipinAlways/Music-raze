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


export async function createStream({groupId}:{groupId:string}) {
  try {

      const group = await db.group.findUnique({
          where:{
              id:groupId
          }
      })

      if(!group){
          throw new Error('not able to fund group')
      }
      return await db.activeStreams.create({
          data:{
              groupId:groupId,
              type:"Spotify",
              userId:group?.userId
          }
      })
      
  } catch (error) {
      console.log(error);
  }
}

interface urlTypes{
  groupId:string
  link:string
  image:string
  title:string
}

// import { db } from "@/lib/db"; // Assuming db is properly imported
// import { urlTypes } from "@/types/urlTypes"; // Assuming you have a urlTypes type defined

export async function addUrl({ image, title, groupId, link }: urlTypes) {
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

    // Find the active stream associated with the group
    const stream = await db.activeStreams.findUnique({
      where: {
        groupId: groupId,
      },
    });

    if (!stream) {
      throw new Error("Unable to find stream");
    }

    // Create a new URL entry in the database
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
    throw error; // Re-throw the error to be handled by the calling function
  }
}

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

export async function findStream({ grpId }: { grpId: string }) {


  try {
      const group = await db.group.findFirst({
          where:{
              id:grpId
          },
          include:{
              ActiveStreams:true
          }
      })
      if (!group) {
          throw new Error('not able to find group ')
      }
     

      const stream = await db.activeStreams.findFirst({
          where: {
              userId: group.userId,
          },
      });

      return stream;
  } catch (error) {
      throw new Error('Could not find any stream for the given group');
  }
}



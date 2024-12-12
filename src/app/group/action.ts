
'use server'


import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { use } from "react";

export async function findStream({ groupID }: { groupID: string }) {
  await db.$connect()
    try {
      const group  = await db.group.findFirst({
        where:{
          id:groupID
        }
      })

        if (!group) {
          throw new Error('not able to find group')
        }

    return await db.activeStreams.findUnique({
      where: {
        id: group.streamId,
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


export async function checkMember() {
  await db.$connect()
  const session = await getServerSession(authOptions)
  try {
    if (!session?.user?.email ) {
      throw new Error('login fiest')
    }

    const user = await db.user.findUnique({
      where:{
        email:session?.user?.email
      }
    })
    return user
  } catch (error) {
      throw new Error('error while checking')
  }
}



export async function updateMemberList(groupID:string) {
  await db.$connect()
  const session = await getServerSession(authOptions)
  try {
    if (!session?.user?.email ) {
      throw new Error('login fiest')
    }

    const user = await db.user.findUnique({
      where:{
        email:session?.user?.email
      }
    })
    if (!groupID) {
      throw new Error('not able to find group')
    }

    const group = await db.group.findUnique({
      where: { id: groupID },
      select: { members: true },
    });
    if (!groupID) {
      throw new Error('not able to find group')
    }

    const allREady = group?.members.includes(user?.id!)


    if (allREady) {
      throw new Error('hain tu')
    }

    
    const updateMember = await db.group.update({
      where:{
        id:groupID
      },
      data:{
        members:{
          push:user?.id
        }
      }
    })
  } catch (error) {
      throw new Error('error while checking')
  }
}
export async function updateMemberListDelete(groupID:string) {
  await db.$connect()
  const session = await getServerSession(authOptions)
  try {
    if (!session?.user?.email ) {
      throw new Error('login fiest')
    }

    const user = await db.user.findUnique({
      where:{
        email:session?.user?.email
      }
    })

    const group = await db.group.findUnique({
      where: { id: groupID },
      select: { members: true },
    });
    if (!groupID) {
      throw new Error('not able to find group')
    }
    const updatedMembers = group?.members.filter((memberId: string) => memberId !== user?.id);
    const updateMember = await db.group.update({
      where:{
        id:groupID
      },
      data:{
        members:{
          set:updatedMembers
        }
      }
    })
  } catch (error) {
      throw new Error('error while checking')
  }
}

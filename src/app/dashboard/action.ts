'use server'
import { getServerSession, User } from "next-auth";
import { authOptions } from "@/lib/auth"
import { db } from "@/db";

export async function GetCreatedGrp() {
  const session = await getServerSession(authOptions);
  const client: User = session?.user as User;

  if (!session || !client?.email) {
    throw new Error("User not authenticated or missing email");
  }

  const user = await db.user.findFirst({
    where: {
      email: client.email,
    },
    include: {
      group: true, 
    },
  });

  if (!user) {
    throw new Error("No user found with the given email");
  }

  try {
    const createdOne = await db.group.findMany({
      where: {
        admin: user.id,
      }

      
    });
    const addedOne = await db.group.findMany({
      where:{
        members:{
          hasSome:[user.id]
        }
      }
    })

    return {addedOne,createdOne};
  } catch (error) {
    console.log(error);
    throw new Error("syntax error");
  }
}


export async function  getFavoriteSongs() {
  await db.$connect()
  try {
    const session = await getServerSession(authOptions);
  const client: User = session?.user as User;

  if (!session || !client?.email) {
    throw new Error("User not authenticated or missing email");
  }

  const user = await db.user.findFirst({
    where: {
      email: client.email,
    },
    include: {
      group: true, 
    },
  });

  if (!user) {
    throw new Error("No user found with the given email");
  }

  return await db.favroutie.findMany({
    where:{
      userId:user.id
    },
 
  })
  } catch (error) {
    throw new Error('can not find favorite song')
  }
}

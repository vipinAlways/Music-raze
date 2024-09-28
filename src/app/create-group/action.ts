"use server";

import { db } from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function CreateGrp({
  groupName,
  description,
}: {
  groupName: string;
  description: string;
}) {
  const session = await getServerSession(authOptions);
  const client: User = session?.user as User;

  if (!session || !client?.email) {
    throw new Error("User not authenticated or missing email");
  }

  if (!groupName) {
    throw new Error ('please fill group name')
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
    
    if (user.group.length >= 1) {
      throw new Error("Only one free group is allowed per user");
    }

    
    const newGrp = await db.group.create({
      data: {
        type: "anyone",
        userId: user.id,
        description: description,
        groupName: groupName,
        members: [],
        admin: user.id,
        streamId: "",
      },
    });

    
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        group: {
          connect: {
            id: newGrp.id,
          },
        },
      },
    });

    return { success: true, group: newGrp }; 
  } catch (error) {
    throw new Error(`Failed to create group: ${error}`);
  }
}



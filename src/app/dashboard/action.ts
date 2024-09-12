'use server'
import { getServerSession, User } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

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
    return await db.group.findMany({
      where: {
        admin: user.id,
      }
      
    });
  } catch (error) {
    console.log(error);
    throw new Error("syntax error");
  }
}

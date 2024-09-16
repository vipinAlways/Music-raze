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



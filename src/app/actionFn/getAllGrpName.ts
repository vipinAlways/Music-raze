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



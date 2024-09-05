"use server";

import { db } from "@/lib/db";

export async function getAllGrpNames() {
   return  await db.group.findMany({})
}

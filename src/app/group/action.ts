import { db } from "@/lib/db";

export async function Group(id:string) {
   return await db.group.findUnique({
        where:{
            id:id
        }
    })
}
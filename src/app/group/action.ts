import { db } from "@/lib/db";

export async function Group(id:string) {
 try {
      return await db.group.findUnique({
           where:{
               id:id
           }
       })
 } catch (error) {
    throw new Error('could not found any group')
 }
}
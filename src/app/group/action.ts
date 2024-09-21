import { db } from "@/lib/db";




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
       
  
        const stream = await db.activeStreams.findMany({
            where: {
                userId: group.userId,
            },
        });
  
        return stream;
    } catch (error) {
        throw new Error('Could not find any stream for the given group');
    }
  }
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvotesSchema = z.object({
    streamId:z.string(),
})


export async function POST(req:NextRequest) {
    const session = await getServerSession()
    if (!session?.user?.email) {
        return NextResponse.json({
            message:'not able to get user with provided credentials'
        })
    }

    const user =await prismaClient.user.findFirst({
        where:{
            email:session?.user.email
        }
    })

    if (!user) {
        return NextResponse.json({
            message:'not able to get user with provided credentials'
        })
    }

    
    try {
        const data = UpvotesSchema.parse(await req.json())

        await prismaClient.upVotes.create({
            data:{
                userID:user.id,
                streamId:data.streamId
            }
        })
    } catch (error) {
        return NextResponse.json({
            message:'not able to upvotes or tring to do it twice'
        })
    }
}
import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { resourceUsage } from "process";
import { Stream } from "stream";
import { z } from "zod";

const YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
const CreateStream = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStream.parse(await req.json());
    const YT_URL = YT_REGEX.test(data.url);

    if (!YT_URL) {
      return NextResponse.json(
        {
          message: "Wrong url",
        },
        { status: 405 }
      );
    }

    const extractedId = data.url.split("?v=")[1];
    await prismaClient.activeStreams.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
      },
    });

    return NextResponse.json({
      message:"Stream has been creeated"
    },{status:200})
  } catch (error) {
    return NextResponse.json(
      {
        message: "error while add stream",
      },
      { status: 411 }
    );
  }
}

export async function GET(req:NextRequest) {
  const creatorId = req.nextUrl.searchParams.get('creactorId') 

  const streams = await prismaClient.activeStreams.findMany({
    where:{
      userId:creatorId!
    }

    
  })

  return NextResponse.json({
    streams
  })
}

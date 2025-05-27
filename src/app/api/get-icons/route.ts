"use server"


import { NextResponse } from "next/server";

export async function GET(req:Request) {
    const {searchParams} = new URL(req.url)
    const name = searchParams.get("name") || "";
  try {
    const response = await fetch(`https://api.iconfinder.com/v4/icons/search?query=${name}&count=10`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:      
          "Bearer X0vjEUN6KRlxbp2DoUkyHeM0VOmxY91rA6BbU5j3Xu6wDodwS0McmilLPBWDUcJ1",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({message:"Failed to fetch",ok:false},{status:400})
    }

    return NextResponse.json({data,ok:true},{status:200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({error:"Server error fetching icons",ok:false},{status:500})
  }
}

"use client"
import { Songs } from "@/components/SongsScroll";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

 function page() {
  const session = useSession()

  return (
    <div className="grid max-sm:flex max-sm:flex-col-reverse max-sm:items-center  grid-cols-2 w-full justify-between h-full  lg:pt-7 sm:pt-24">
      <div className="lg:w-4/5 w-full h-full max-sm:h-[100%] rounded-md flex justify-start items-center ">
        <Songs/>
      </div>

      <div className="text-slate-200 flex flex-col items-center justify-around h-full">
        <div>
          <p className="text-center lg:text-6xl font-serif w-full max-sm:text-2xl">
          Welcome to Music Raze
          </p>
          <p className="text-center w-4/5 mx-auto text-5xl max-sm:text-xl font-serif">
            where you can enjoy your favorite song hooks with the ones you love
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 w-full">
          <Image
            src="/testimonials/7.gif"
            alt="Enjoy Life GIF"
            className="object-contain"
            height={176}
            width={176}
          />
          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className={cn("p-2 py-3 text-xl", session ? "hidden" : null)}
          >
            Join Us
          </Button>
          <Button className={cn("p-2 py-3 text-xl", session ? null : "hidden")}>
            <Link href="/dashboard">Join Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default page;

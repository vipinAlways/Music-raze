import { Songs } from "./SongsScroll";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import React from "react";

function Home() {
  
const session = useSession();

  return (
    <div className="grid max-md:flex max-md:flex-col-reverse max-md:items-center  grid-cols-2 w-full justify-between h-full  lg:pt-7 sm:pt-24">
      <div className="lg:w-4/5 w-full h-full max-md:h-[100%] rounded-md flex justify-start items-center ">
        <Songs />
      </div>

      <div className="text-slate-200 flex flex-col items-center justify-around h-full">
        <div>
          <p className="text-center lg:text-6xl font-serif w-full max-md:text-2xl">
            Welcome to Music Raze
          </p>
          <p className="text-center w-4/5 mx-auto text-5xl max-md:text-xl font-serif">
            where you can enjoy your favorite song hooks with the ones you love
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 w-full">
        
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

export default Home;

"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { HTMLAttributes } from "react";

export interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  className?: string;
  dark?: boolean;
}

function Container({ className, imgSrc, dark = false, ...props }: PhoneProps) {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden lg:h-40 h-20 w-full flex items-center justify-center ",
        className
      )}
      {...props}
    >
      <Image
        src={imgSrc}
        className="h-full w-full object-contain rounded-lg"
        alt="song img"
        fill
        loading="lazy"
        
      />
    </div>
  );
}

export default Container;

'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { HTMLAttributes } from 'react';

export interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  className?: string;
  dark?: boolean;
}

function Container({ className, imgSrc, dark = false, ...props }: PhoneProps) {
  return (
    <div
      className={cn(
        'relative pointer-events-none z-50 overflow-hidden lg:h-60 h-20 w-full',
        className
      )}
      {...props}
    >
      <div className="">
        <Image
          src={imgSrc}
          className="h-full w-full object-contain rounded-l"
          alt="song img"
        />
      </div>
    </div>
  );
}

export default Container;
"use client";

import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Container from "./Container";

const SONGS = [
  "/testimonials/1.jpg",
  "/testimonials/2.jpg",
  "/testimonials/3.jpg",
  "/testimonials/4.jpg",
  "/testimonials/5.jpg",
  "/testimonials/6.jpg",
];

function splitArray<T>(array: Array<T>, numParts: number) {
  const result: Array<Array<T>> = [];

  for (let i = 0; i < array.length; i++) {
    const index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }

  return result;
}

function SongsColumn({
  songs,
  className,
  reviewClassName,
  msPerPixel = 0,
}: {
  songs: string[];
  className?: string;
  reviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
}) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [columnHeight, setColumnHeight] = useState(0);
  const duration = `${columnHeight * msPerPixel}ms`;

  useEffect(() => {
    if (!columnRef.current) return;

    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight ?? 0);
    });

    resizeObserver.observe(columnRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={columnRef}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      {songs.concat(songs).map((imgSrc, reviewIndex) => (
        <Song
          key={reviewIndex}
          className={reviewClassName?.(reviewIndex % songs.length)}
          imgSrc={imgSrc}
        />
      ))}
    </div>
  );
}

interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
}

function Song({ imgSrc, className, ...props }: ReviewProps) {
  const POSSIBLE_ANIMATION_DELAYS = [
    "0s",
    "0.1s",
    "0.2s",
    "0.3s",
    "0.4s",
    "0.5s",
  ];

  const animationDelay =
    POSSIBLE_ANIMATION_DELAYS[
      Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)
    ];

  return (
    <div
      className={cn(
        "animate-fade-in rounded-xl lg:h-56 h-28  bg-[#4b2ee0] lg:p-6 p-3 opacity-0 shadow-xl shadow-slate-900/5",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <Container imgSrc={imgSrc} />
    </div>
  );
}

function ReviewGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  const columns = splitArray(SONGS, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = splitArray(columns[2], 2);

  return (
    <div
      ref={containerRef}
      className="grid  lg:max-h-[77vh]  max-md:h-[50vh] rounded-md items-start gap-8 overflow-hidden grid-cols-3"
    >
      {isInView ? (
        <>
          <SongsColumn
            songs={[...column1, ...column3.flat(), ...column2]}
            reviewClassName={(reviewIndex) =>
              cn({
                "md:hidden": reviewIndex >= column1.length + column3[0].length,
                "lg:hidden": reviewIndex >= column1.length,
              },)
            }
            msPerPixel={10}
          />
          <SongsColumn
            songs={[...column2, ...column3[1]]}
            className=""
            reviewClassName={(reviewIndex) =>
              reviewIndex >= column2.length ? "block" : ""
            }
            msPerPixel={15}
          />
          <SongsColumn songs={column3.flat()} className="" msPerPixel={10} />
        </>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 -top-2 h-32 bg-gradient-to-b from-slate-500 rounded-lg" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-500 rounded-lg" />
    </div>
  );
}

export function Songs() {
  return (
    <div className="relative w-full md:px-10 rounded-md ">
      <ReviewGrid />
    </div>
  );
}

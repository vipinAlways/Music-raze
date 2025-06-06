"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { ChangeEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllGrpNames } from "@/app/actionFn/getAllGrpName";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import { Group } from "@/app/dashboard/page";


function Appbar() {
  const pathname = usePathname();
  const session = useSession();
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<
    { id: string; groupName: string }[]
  >([]);
  const [showOptions, setShowOptions] = useState<boolean>(true);
  

  const { data, error, isLoading } = useQuery({
    queryKey: ["getgrp-name"],
    queryFn: async () => getAllGrpNames(),
  });

  const options = data
    ? data.map((group: Group) => ({ id: group.id, groupName: group.groupName }))
    : [
        { id: "default1", groupName: "hello" },
        { id: "default2", groupName: "hello 2" },
      ];

  useEffect(() => {
    const savedInputValue = localStorage.getItem("inputValue");
     

    if (savedInputValue) {
      setInputValue(savedInputValue);
    }


  }, [ pathname]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filtered = options.filter((option: { id: string; groupName: string }) =>
        option.groupName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const handleOptionClick = (option: { id: string; groupName: string }) => {
    setInputValue(option.groupName);
  };

  return (
    <div className="flex justify-between max-md:flex-col items-center min-h-20 text-white">
      <div className="flex justify-between items-center h-full w-full">
        <div>
          <Link href="/" className="text-lg lg:text-xl font-serif">
            Music Raze
          </Link>
        </div>
        <div className="relative min-w-96  max-md:hidden flex items-center gap-2">
          <input
            type="text"
           
            className="h-10 px-4 w-96 rounded-xl border border-gray-300 text-black focus:outline-none"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={() => setTimeout(() => setShowOptions(false), 100)}
            onFocus={() => inputValue && setShowOptions(true)}
          />
          {showOptions && filteredOptions.length > 0 && (
            <ul className="absolute z-10 w-full bg-[#7C3AED] rounded-xl mt-24 max-h-48 overflow-y-auto">
              {filteredOptions.map((option) =>
                isLoading ? (
                  <div key={option.id}>
                    <li className="px-4 py-2 hover:bg-[#5b1dc5] cursor-pointer"></li>
                  </div>
                ) : error && filteredOptions.length === 0 ? (
                  <div
                    key={option.id}
                    className="px-4 py-2 hover:bg-[#5b1dc5] cursor-pointer"
                  >
                    Not able to Find that
                  </div>
                ) : option.id && (
                  <Link
                    href={`/group/${option.id}`}
                    key={option.id}
                    className="text-start cursor-pointer flex-col items-center h-12 w-full "
                    onClick={() => handleOptionClick(option)}
                  >
                    <h2 className="text-lg p-0 h-full py-3 px-3">
                      {option.groupName}
                    </h2>
                  </Link>
                )
              )}
            </ul>
          )}
         
        </div>

        <div className="flex items-center gap-5">
          {session.data?.user ? (
            <Button
              className="m-2 p-2 font-medium"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Log out
            </Button>
          ) : (
            <Button
              className="m-2 p-2 "
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
      <div className="">
        <div className="relative w-full md:hidden flex items-center gap-2">
          <input
            type="text"
            id="search"
            className="h-10 px-4 w-[100%] rounded-xl border sticky top-0  border-gray-300 text-black focus:outline-none"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={() => setTimeout(() => setShowOptions(false), 100)}
            onFocus={() => inputValue && setShowOptions(true)}
          />
          {showOptions && filteredOptions.length > 0 && (
            <ul className="absolute z-10 w-full bg-[#7C3AED] rounded-xl lg:mt-24 mt-28 max-h-48 overflow-y-auto ">
              {filteredOptions.map((option:{id:string,groupName:string}) =>
                isLoading ? (
                  <div key={option.id}>
                    <li className="px-4 py-2 hover:bg-[#5b1dc5] cursor-pointer"></li>
                  </div>
                ) : error ? (
                  <div
                    key={option.id}
                    className="px-4 py-2 hover:bg-[#5b1dc5] cursor-pointer"
                  >
                    Not able to find that
                  </div>
                ) : (
                  <Link
                    href={`/group/${option.id}`}
                    key={option.id}
                    className="text-start cursor-pointer flex-col items-center h-12 w-full "
                    onClick={() => handleOptionClick(option)}
                  >
                    <h2 className="text-lg p-0 h-full py-3 px-3">
                      {option.groupName}
                    </h2>
                  </Link>
                )
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Appbar;

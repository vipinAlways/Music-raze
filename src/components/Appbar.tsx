"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { ChangeEvent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllGrpNames } from "@/app/actionFn/getAllGrpName";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGroup } from "./GroupContextType ";
// import { useGroup } from "@/context/GroupContext"; // Import the custom hook

function Appbar() {
  const router = useRouter();
  const session = useSession();
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<
    { id: string; groupName: string }[]
  >([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const { groupID, setGroupID } = useGroup(); // Use the custom hook to access and set groupID

  const { data, error, isLoading } = useQuery({
    queryKey: ["getgrp-name"],
    queryFn: async () => getAllGrpNames(),
  });

  const options = data
    ? data.map((group: any) => ({ id: group.id, groupName: group.groupName }))
    : [
        { id: "default1", groupName: "hello" },
        { id: "default2", groupName: "hello 2" },
      ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filtered = options.filter((option) =>
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
    setShowOptions(false);
  };

  const onselect = () => {
    const selectedGroup = options.find(
      (option) => option.groupName === inputValue
    );
    if (selectedGroup) {
      setGroupID(selectedGroup.id); 
    }
  };

  return (
    <div className="flex justify-between items-center h-20 text-white ">
      <div>
        <h1 className="text-lg lg:text-xl font-serif ">Music Raze</h1>
      </div>
      <div className="relative w-96 max-sm:hidden flex items-center gap-2">
        <input
          type="text"
          id="search"
          className="h-10 px-4 w-80 rounded-xl border border-gray-300 focus:outline-none"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={() => setTimeout(() => setShowOptions(false), 100)}
          onFocus={() => inputValue && setShowOptions(true)}
        />
        {showOptions && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl mt-24 max-h-48 overflow-y-auto">
            {filteredOptions.map((option) =>
              isLoading ? (
                <div key={option.id}>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer"></li>
                </div>
              ) : error && filteredOptions.length === 0 ? (
                <div
                  key={option.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  Not able to Find that
                </div>
              ) : (
                <li
                  key={option.id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleOptionClick(option)}
                >
                  <h2>{option.groupName}</h2>
                </li>
              )
            )}
          </ul>
        )}
        <Button onClick={onselect}>
          <Link href="/group">select</Link>
        </Button>
      </div>

      <div className="flex items-center gap-5">
      
        {session.data?.user ? (
          <Button className="m-2 p-2 font-medium" onClick={() => signOut()}>
            Log out
          </Button>
        ) : (
          <Button className="m-2 p-2 bg" onClick={() => signIn()}>
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}

export default Appbar;

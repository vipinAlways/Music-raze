"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { ChangeEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllGrpNames } from "@/app/actionFn/getAllGrpName";


function Appbar() {
  const session = useSession();
  
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<{ id: string; groupName: string }[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  
  

  const { data, error, isLoading } = useQuery({
    queryKey: ['getgrp-name'],
    queryFn: async () => getAllGrpNames()
  });

  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching group data</div>;

  
  const options = data
    ? data.map((group: any) => ({ id: group.id, groupName: group.groupName }))
    : [{ id: 'default1', groupName: 'hello' }, { id: 'default2', groupName: 'hello 2' }];

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

  const onselect = ()=>{
    options.map((option)=>{
      if (option.groupName === inputValue) {
        console.log(option.id);
      }
    })
  }
  return (
    <div className="flex justify-between items-center h-20 ">
      <div>
        <h1 className="text-lg">Music Raze</h1>
      </div>
      <div className="relative w-96 flex items-center gap-2">
        <input
          type="text"
          id="search"
          className=" h-10 px-4 w-80 rounded-xl border border-gray-300 focus:outline-none"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={() => setTimeout(() => setShowOptions(false), 100)}
          onFocus={() => inputValue && setShowOptions(true)}
        />
        {showOptions && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl mt-24 max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <li
                key={option.id} 
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleOptionClick(option)}
              >
                {option.groupName} 
              </li>
            ))}
          </ul>
        )}
        <Button onClick={onselect} >Select</Button>
      </div>

      <div className="flex items-center gap-5">
        <div className="w-32 border rounded-full h-10 flex items-center p-2">
          <Button className="w-2 h-2 rounded-full">+</Button>
        </div>
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

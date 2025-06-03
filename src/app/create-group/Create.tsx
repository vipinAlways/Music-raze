"use client";

import React, { useEffect, useState } from "react";
import { CreateGrp } from "./action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

function Create() {
  const [description, setDescription] = useState("");
  const [groupName, setGroupName] = useState("");
  const [avatar, setAvatar] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["Group-key"],
    mutationFn: CreateGrp,
    onError: (error) =>
      toast({
        title: "Error",
        description: "Only one free group is allowed per user",
        variant: "destructive",
      }),
    onSuccess: () => {
      toast({
        title: "Group created",
        description: "Group created successfully",
      }),
        setTimeout(() => {
          router.push("/dashboard");
        }, 150);
    },
  });

  useEffect(() => {
    const handleSubmit = () => {
      mutation.mutate({ groupName, description, avatar });
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };

    window.document.addEventListener("keydown", handleKeydown);

    return () => {
      window.document.removeEventListener("keydown", handleKeydown);
    };
  }, [avatar,groupName, description, mutation]);

    const fetchIcons = async (name: string) => {
    const res = await fetch(`/api/get-icons?name=${name}`);
    if (!res.ok) throw new Error("Failed to fetch icons");
    const result = await res.json();
    return result.data.icons;
  };

  const { data: icons = [] ,isLoading} = useQuery({
    queryKey: ["icons", groupName],
    queryFn: async () => await fetchIcons(groupName),
  });
  return (
    <div className="lg:w-[60%] sm:w-4/5 max-md:mt-5 flex px-3 items-center justify-center mx-auto overflow-y-auto overflow-x-hidden">
      <Tabs defaultValue="Create Group" className="lg:w-[60%] sm:w-3/5  lg:h-[80vh] max-sm:h-[80vh] ">
        <TabsList className="grid w-full grid-col-1">
          <TabsTrigger value="Create Group">Create Group</TabsTrigger>
        </TabsList>
        <TabsContent value="Create Group">
          <Card>
            <CardHeader>
              <CardTitle>Create Group</CardTitle>
              <CardDescription>
                Create a group where you can enjoy your favorite music, sharing
                special moments with your loved ones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="Gorup-Name">Group Name</Label>
                <Input
                  id="Gorup-Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  placeholder="Group Name"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                />
              </div>

               <div className="flex flex-wrap gap-4 items-center">
                  { icons?.map((icon: any, index: number) => {
                    const iconUrl =
                      icon.raster_sizes[icon.raster_sizes.length - 1].formats[0]
                        .preview_url;
                    const isSelected = icon === iconUrl;

                 if(iconUrl){
                     return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setAvatar(iconUrl)}
                        className={`border-2 rounded-lg p-1 focus:border-blue-500 hover:border-blue-400 h-16 w-16 ${
                          isSelected ? "border-blue-500" : "border-transparent"
                        }`}
                      >
                        <Image
                          src={!iconUrl ? "/giphy.gif": iconUrl}
                          height={56}
                          width={56}
                          alt={`Icon ${index + 1}`}
                          className="rounded"
                        />
                      </button>
                    );
                 }
                  })}
                </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() =>
                  mutation.mutate({ groupName, description, avatar })
                }
                disabled={mutation.isPending}
                aria-busy={mutation.isPending}
                className="bg-red-600 w-28"
              >
                {mutation.isPending ? "Creating..." : "Submit"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password"></TabsContent>
      </Tabs>
    </div>
  );
}

export default Create;

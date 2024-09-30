"use client";

import React, { useEffect, useState } from "react";
import { CreateGrp } from "./action";
import { useMutation } from "@tanstack/react-query";
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

function Create() {
  const [description, setDescription] = useState("");
  const [groupName, setGroupName] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["Group-key"],
    mutationFn: CreateGrp,
    onError: (error) =>
      toast({
        title: "Error",
        description: "Only one free group is allowed per user" ,
        variant: "destructive",
      }),
    onSuccess: () =>
     {
      toast({
        title: "Group created",
        description: "Group created successfully",
      }),
      setTimeout(() => {
        router.push("/dashboard");
      }, 150);
     }
  });

  const handleSubmit = () => {
   
    // e.preventDefault();
    mutation.mutate({ groupName, description });
    
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit()
      }
    };

    window.document.addEventListener("keydown", handleKeydown);

    return () => {
      window.document.removeEventListener("keydown", handleKeydown);
    };
  }, [groupName]);
  return (
    <div className="bg-[#d7c5b6]/20 backdrop-blur-xl opacity-80 sm:h-[calc(100vh-10rem)] max-sm:h-[70vh]  lg:w-[60%] sm:w-4/5 max-sm:mt-5 flex  items-center justify-center mx-auto rounded-xl">
      
      <Tabs defaultValue="Create Group" className="lg:w-[60%] sm:w-3/5 hello">
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
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
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

"use client";

import React, { useState } from "react";
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
        description: error.message || "An error occurred",
        variant: "destructive",
      }),
    onSuccess: () =>
      toast({
        title: "Group created",
        description: "Group created successfully",
      }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ groupName, description });
    setTimeout(() => {
      router.push("/dashboard");
    }, 150);
  };

  return (
    <div className="bg-[#d7c5b6]/20 backdrop-blur-xl opacity-80 h-[calc(100vh-10rem)] w-[60%] flex  items-center justify-center mx-auto rounded-xl">
      {/* <form
        className="flex flex-col gap-1  opacity-100 h-60 justify-around items-center "
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
          placeholder="Group Name"
          className="h-12 w-96 rounded-lg text-center bg-yellow-300  "
        />
        <input
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="h-12 w-96 rounded-lg text-center  bg-yellow-300  "
        />
        <Button
          type="submit"
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
          className="bg-red-600 w-28"
        >
          {mutation.isPending ? "Creating..." : "Submit"}
        </Button>
      </form> */}

      <Tabs defaultValue="Create Group" className="w-[50%]">
        <TabsList className="grid w-full grid-col-1">
          <TabsTrigger value="Create Group">Create Group</TabsTrigger>
       
        </TabsList>
        <TabsContent value="Create Group">
          <Card>
            <CardHeader>
              <CardTitle>Create Group</CardTitle>
              <CardDescription>
              Create a group where you can enjoy your favorite music, sharing special moments with your loved ones
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
        <TabsContent value="password">
        
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Create;
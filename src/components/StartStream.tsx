import { createStream } from '@/app/actionFn/getAllGrpName'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { Button } from './ui/button'

function StartStream({grpid}:{grpid:string}) {
    const {toast} = useToast()

    const {mutate} = useMutation({
        mutationKey:['createStream'],
        mutationFn:createStream,
        onError: (error) =>
            toast({
              title: "Error",
              description: error.message || "An error occurred",
              variant: "destructive",
            }),
          onSuccess: () =>
            toast({
              title: "Stream started",
              description: "Stream started successfully",
            }),
    })

    const handleSubmit = (e:React.FormEvent)=>{

      

        e.preventDefault()
        mutate({groupId:grpid})
    }
  return (
    <Button onClick={handleSubmit}>
            Start Stream
          </Button>
  )
}

export default StartStream
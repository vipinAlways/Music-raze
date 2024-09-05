'use client';

import React, { useState } from 'react';
import { CreateGrp } from './action';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function Create() {
  const [description, setDescription] = useState('');
  const [groupName, setGroupName] = useState('');
  const { toast } = useToast();
  const router = useRouter()

  const mutation = useMutation({
    mutationKey: ['Group-key'], 
    mutationFn: CreateGrp,
    onError: (error) => toast({
      title: 'Error',
      description: error.message || 'An error occurred',
      variant: 'destructive',
    }),
    onSuccess: () => toast({
      title: 'Group created',
      description: 'Group created successfully',
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ groupName, description });
    setTimeout(() => {
      router.push('/dashboard')
    }, 150);
  };

  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          name="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
          placeholder="Group Name"
        />
        <input
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}  
          placeholder="Description"
        />
        <button type="submit" disabled={mutation.isPending} aria-busy={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default Create;

'use client'

import React from 'react';
import { members } from '@prisma/client';
import { useFormState, useFormStatus } from 'react-dom';
import { Label } from '@/components/ui/label';
import { addMember, updateMember } from '@/actions/members';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending} className='my-4'>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  )
}

const MemberForm = ({ member }: { member?: members | null}) => {
  const [error, action] = useFormState(
    member == null ? addMember: updateMember.bind(null, member.id),
    {}
  )

  return (
    <form action={action} className='space-y-8' >
      <div className='space-y-2'>
        <Label htmlFor='name_full'>Name (full)</Label>
        <Input 
          type='text'
          id='name_full'
          name='name_full'
          required
          defaultValue={member?.name_full || ''}
        />
        {error.name_full && <div className='text-destructive'>{error.name_full}</div>}        
      </div>
      <div className='space-y-2'>
        <Label htmlFor='name_detail'>Name (detail)</Label>
        <Input 
          type='text'
          id='name_detail'
          name='name_detail'
          defaultValue={member?.name_detail || ''}
        />
        {error.name_detail && <div className='text-destructive'>{error.name_detail}</div>}   
      </div>
      <div className='space-y-2'>
        <Label htmlFor='address'>Address</Label>
        <Input 
          type='text'
          id='address'
          name='address'
          defaultValue={member?.address || ''}
        />
        {error.address && <div className='text-destructive'>{error.address}</div>}   
      </div>
      <div className='space-y-2'>
        <Label htmlFor='city'>City</Label>
        <Input 
          type='text'
          id='city'
          name='city'
          defaultValue={member?.city || ''}
        />
        {error.city && <div className='text-destructive'>{error.city}</div>}   
      </div>
      <div className='space-y-2'>
        <Label htmlFor='province'>Province</Label>
        <Input 
          type='text'
          id='province'
          name='province'
          defaultValue={member?.province || ''}
        />
        {error.province && <div className='text-destructive'>{error.province}</div>}   
      </div>
      <div className='space-y-2'>
        <Label htmlFor='postal'>Postal</Label>
        <Input 
          type='text'
          id='postal'
          name='postal'
          defaultValue={member?.postal || ''}
        />
        {error.postal && <div className='text-destructive'>{error.postal}</div>}   
      </div>
      <SubmitButton />
    </form>
  );
}

export default MemberForm;
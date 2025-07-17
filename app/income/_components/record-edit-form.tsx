'use client'

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IncomeRecordProps } from '../[id]/edit/page';
import { IncomeType } from '../create/page';
import { useFormStatus } from 'react-dom';
import { formatDate } from '@/lib/formatters';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending} className='my-4'>
      {pending ? 'Updating...' : 'Update'}
    </Button>
  )
}

const IncomeSchema = z.object({
  name: z.string().trim().min(2),
  amount: z.preprocess((a) => parseInt(a as string), z.number().positive()),
  type: z.string({ message: 'Please select an income type'}),
  notes: z.string().trim().optional()
});

const IncomeRecordEditForm = ({ incomeRecord, incomeTypes, memberName }: {
    incomeRecord : IncomeRecordProps;
    incomeTypes: IncomeType[];
    memberName: string;
  }
) => {  
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(() => {
    const year = Number(incomeRecord.year);
    const month = Number(incomeRecord.month);
    const day = Number(incomeRecord.day);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      console.error('Invalid date components:', { year, month, day });
      return new Date();
    }

    return new Date(year, month - 1, day);
  });

  // console.log('Initialized Date:', date);  
  // console.log(date);

  const nameRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof IncomeSchema>>({
    resolver: zodResolver(IncomeSchema),
    defaultValues: {
      name: memberName,
      amount: incomeRecord?.amount || 0,
      type: incomeRecord?.type ? incomeRecord.type.toString() : '',
      notes: incomeRecord?.notes || '',
    },
  });
  
  const onSubmit = async (data: z.infer<typeof IncomeSchema>) => {    
    // console.log(data, formatDate(date!), ' updating...')
    
    const dateCompare: string = incomeRecord.year + '-' + incomeRecord.month + '-' + incomeRecord.day;
    const updateIncome: IncomeRecordProps = {
      id: incomeRecord.id,
      type: parseInt(data.type),
      amount: data.amount,
      memberName: data.name!.trim().replace(/\s/g, ''),
      year: parseInt(formatDate(date).split('-')[0]),
      month: parseInt(formatDate(date).split('-')[1]),
      day: parseInt(formatDate(date).split('-')[2]),
      notes: data.notes!
    };

    // fetch
    if( // only if some of data have been changed, send request the sever
      memberName !== data.name.trim().replace(/\s/g, '') ||
      incomeRecord.amount !== data.amount ||
      incomeRecord.type !== parseInt(data.type) ||
      incomeRecord.notes !== data.notes!.trim() ||
      dateCompare !== formatDate(date!)
    ) {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_REST_URL+'/income', {
          method: 'PATCH',
          body: JSON.stringify(updateIncome),
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        const data = await res.json();
        console.log(data);        

        router.push('/income');
      } catch (e) {
        console.error('Error in fech request: ', e);
      }
    }
  }

  return (
    <div className='mt-4'>
      <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)}>        
        <div className='flex-col md:grid md:grid-cols-4 md:gap-x-3 '>
          <div className="flex items-end">            
            <div>
              <div className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-3'>Date of Record</div>
              <Popover open={open} onOpenChange={setOpen}>                         
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[200px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'yyyy-MM-dd') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar 
                    mode='single'
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate!);
                      setOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>          
              </Popover> 
            </div>
          </div>        
          <div>
            <FormField 
              // control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      ref={nameRef}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
        
          </div>
          <div>
            <FormField 
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (in cents)</FormLabel>
                  <FormControl>
                    <Input  {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
          </div>
          <div>
            <FormField 
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Type</FormLabel>
                  <Select onValueChange={(value) => value && field.onChange(value)} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? <SelectValue placeholder='Select an income type' /> : 'Select an income type'}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {incomeTypes && incomeTypes.map((type) => (
                        <SelectItem value={type.id.toString()} key={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          
          </div>
        </div>
        <div className='mt-3'>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    {...field}
                  />
                </FormControl>              
              </FormItem>
            )}
          />
          
        </div>

        <div className=''>
          <SubmitButton /> 
          <Button asChild className='mb-2 ml-2' variant="secondary">
            <Link href="/income/entries">Cancel</Link>
          </Button>
        </div>  
         
       
      </form>
      </Form>
    </div>
  );
}

export default IncomeRecordEditForm;
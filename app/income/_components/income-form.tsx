'use client'

import React, { useEffect, useRef, useState } from 'react';
import { format } from "date-fns"
import { Calendar as CalendarIcon, MoreVertical } from "lucide-react"
import { IncomeMethod, IncomeType, Member } from '../create/page';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn, getMethodName, getTypeName } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PageHeader from '@/components/page-header';
// import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';


const IncomeSchema = z.object({
  name: z.string().trim().min(2),
  amount: z.preprocess((a) => parseInt(a as string), z.number().positive()),
  type: z.string({ message: 'Please select an income type'}),
  method: z.string({ message: 'Please select an income method'}),
  notes: z.string().trim().optional(),  
});

export type IncomeFormProps = {
  incomeTypes: IncomeType[];
  incomeMethods: IncomeMethod[]
  members?: Member[];
}

export type IncomeEntryDTO = {
  id: number,
  name: string,
  amount: number, // this is amount in cents. should be dived by 100 when it shows the value
  type: number,
  method: number,
  notes?: string,
  year?: number,
  month?: number,
  day?: number,
  qt?: number,
  mid?: number
}

const IncomeForm = ({ incomeTypes, incomeMethods }: IncomeFormProps) => {  
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>();
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntryDTO[]>([]); 
  const [currentTotal, setCurrentTotal] = useState<number>(0);
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [entriesPending, setEntriesPending] = useState<boolean>(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleRemoveEntry = (id: number, amount: number): void => {
    setIncomeEntries((prev) => { return prev.filter((entry) => entry.id !== id) });
    setCurrentTotal((prev) => prev - amount);

  }
  
  const resetEditing = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (editingEntryId !== null) {
      setEditingEntryId(null);
    }
    
    form.setValue('name', '');
    form.setValue('amount', 0);
    form.setValue('type', '');
    form.setValue('notes', '');

    if (nameRef.current) {
      nameRef.current.focus();
    }
  }

  const form = useForm<z.infer<typeof IncomeSchema>>({
    resolver: zodResolver(IncomeSchema),
    defaultValues: {
      name: '',
      amount: 0,
      type: '',
      method: '',
      notes: ''
    }
  });

  const getNextId = () => {
    const ids = incomeEntries.map((entry) => entry.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  };

  const onSubmit = (data: z.infer<typeof IncomeSchema>) => {    
    if (!date) {
      toast({
        title: 'Error',
        description: 'Date is required'
      });
      
      return
    }

    if (editingEntryId !== null) {
      setEditingEntryId(null);
      const oldEntry = incomeEntries.find((entry) => entry.id === editingEntryId);

      if (!oldEntry) {
        toast({
          title: 'Error',
          description: 'Entry not found'
        });

        return;
      }

      const amountDifference = data.amount - oldEntry.amount;
      setCurrentTotal((prev) => prev + amountDifference);

      const updatedEntry = {
        ...oldEntry,
        name: data.name.trim().replace(/\s/g, ''),
        amount: data.amount,
        type: parseInt(data.type),
        method: parseInt(data.method),
        notes: data.notes,
        year: date.getFullYear(),
        month: (date.getMonth() + 1),
        day: date.getDate()
      }

      setIncomeEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === editingEntryId ? updatedEntry : entry
        )
      );

      setEditingEntryId(null);

      if (nameRef.current) {
        nameRef.current.focus();
      }
      
    } else {
      const newIncomeEntry: IncomeEntryDTO = {
        id: getNextId(),
        name: data.name.trim().replace(/\s/g, ''),
        amount: data.amount,
        type: parseInt(data.type),
        method: parseInt(data.method),
        notes: data.notes,
        year: date.getFullYear(),
        month: (date.getMonth()+1),
        day: date.getDate()
      }  

      // console.log(newIncomeEntry);

      setIncomeEntries((prev) => [newIncomeEntry, ...prev]);
      setCurrentTotal((prev) => prev + data.amount);      

      if (nameRef.current) {
        nameRef.current.focus();
      }
    } 
    
    form.setValue('name', '');
    form.setValue('amount', 0);
    form.setValue('type', '');
    form.setValue('method', '');
    form.setValue('notes', '');
  }

  const handleEditEntry = (entry: IncomeEntryDTO) => {    
    setEditingEntryId(entry.id);
    form.reset({
      name: entry.name,
      amount: entry.amount,
      type: entry.type.toString(),
      method: entry.method.toString(),
      notes: entry.notes || '',      
    });    
  }


  // This function gets all the entries save on the database
  const handleSaveEntries = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setEntriesPending(true);

    if(incomeEntries && incomeEntries.length > 0) {      
      try {
        await fetch(process.env.NEXT_PUBLIC_REST_URL+'/income', {
          method: 'POST',
          body: JSON.stringify(incomeEntries),
          headers: {
            'content-type': 'application/json'
          }
        })

        // console.log(res);
      } catch (e) {
        console.log(e);
      } finally {
        window.localStorage.setItem('incomeEntries', '[]');
        setIncomeEntries([]);
        setCurrentTotal(0);
        setDate(undefined);
        
        setEntriesPending(false);

        router.push('/income')

      }
            
    }

    return;
  }
  //console.log(incomeEntries);

  // Load incomeEntries from localStorage on component mount
  useEffect(() => {    
    const storedEntries = JSON.parse(window.localStorage.getItem('incomeEntries')!);

    if(storedEntries && storedEntries.length > 0) {
      setIncomeEntries(storedEntries);
      storedEntries.map((entry: IncomeEntryDTO) => setCurrentTotal((prev) => prev + Number(entry.amount)))

      const entryDate: Date = new Date(storedEntries[0].year + '-' + storedEntries[0].month + '-' + storedEntries[0].day + 'T00:00:00');
      setDate(entryDate);
    }    


  }, []);

  // Save incomeEntries to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('incomeEntries', JSON.stringify(incomeEntries));
    }
  }, [incomeEntries]);

  // console.log(incomeEntries);

  return (
    <Form {...form} >
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className='flex justify-start mb-6'>
        <PageHeader >
          <div>Create Offerings in batch</div>
           <div className='text-sm'>헌금내역을 주별로 일괄 입력 합니다.</div>
          
          </PageHeader>       
        
      </div>

      <div className='mb-4'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[265px] justify-start text-left font-normal',
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
                setDate(selectedDate);
                setOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>          
        </Popover>         
      </div>
      
      <div className='flex-col md:grid md:grid-cols-4 md:gap-x-3 '>        
        <div>
          <FormField 
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} ref={nameRef}/>
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
                      <SelectItem value={type.id.toString()} key={type.id}>{`${type.name} (${type.detail})`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        
        </div>

        <div>
          <FormField 
            control={form.control}
            name='method'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Income method</FormLabel>
                <Select onValueChange={(value) => value && field.onChange(value)} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      {field.value ? <SelectValue placeholder='Select an income method' /> : 'Select an income method'}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {incomeMethods && incomeMethods                    
                  .map((method) => (
                      <SelectItem value={method.id.toString()} key={method.id}>{`${method.name} (${method.detail})`}</SelectItem>
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
        
      <Button type='submit' className='my-4'>
        {editingEntryId !== null ? 'Update Entry' : 'Add Entry'}
      </Button>
      <Button onClick={(e) => resetEditing(e)} className='ml-4 bg-secondary text-foreground'>
        Reset
      </Button>
      
      <div className='flex justify-end'>
        <span className='text-sm font-extrabold pr-6'>Count: <span className='text-lg font-bold pl-3'>{incomeEntries.length}</span></span>
        <span className='text-sm font-extrabold'>Current Total: <span className='text-lg text-blue-800 font-bold pl-3'>{formatCurrency(currentTotal / 100)}</span></span>
      </div>
      <div className="pt-3 pb-6">
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[6rem]'>Date</TableHead>
              <TableHead className='w-[10rem]'>Name</TableHead>
              <TableHead className='w-[6rem]'>Type</TableHead>
              <TableHead className='w-[6rem]'>Amount</TableHead>
              <TableHead className='w-[6rem]'>Method</TableHead>
              <TableHead>notes</TableHead>
              <TableHead className='w-0'>
                <span className='sr-only'>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >
            { incomeEntries && incomeEntries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.year}-{entry.month}-{entry.day}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{getTypeName(entry.type, incomeTypes)}</TableCell>
                <TableCell>{formatCurrency(entry.amount / 100)}</TableCell>
                <TableCell>{getMethodName(entry.method, incomeMethods)}</TableCell>
                <TableCell>{entry.notes}</TableCell>
                <TableCell className='text-center'>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className='sr-only'>Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEditEntry(entry)}>                        
                          Edit                        
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className='text-red-500 font-semibold'
                        onClick={() => handleRemoveEntry(entry.id, entry.amount)}
                      >
                          Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex justify-end py-6'>
          <Button onClick={(e) => handleSaveEntries(e)} disabled={entriesPending}>
            { entriesPending ? "Saving..." : "Save Entries" }
          </Button>
        </div>
      
      </div>
    </form>
    </Form>
    
  );
}

export default IncomeForm;
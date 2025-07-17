'use server'

import { IncomeRecordProps } from '@/app/income/[id]/edit/page';
import { IncomeEntryDTO } from '@/app/income/_components/income-form';
import db from '@/db/db';
import { z } from 'zod';

const incomeEntriesSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string().trim(),
    amount: z.number(),
    type: z.number(),
    note: z.string().optional(),
    year: z.number(),
    month: z.number(),
    day: z.number(),
    mid: z.number(),
    qt: z.number(),
  })
);

export const saveIncomeEntries = async (formData: FormData): Promise<void> => {
  
  const entry = formData.get('incomeEntries');
  let incomeEntries: IncomeEntryDTO[] = [];
  if(typeof entry === 'string') incomeEntries = JSON.parse(entry);

  const validatedEntries = incomeEntriesSchema.safeParse(incomeEntries);

  if (validatedEntries.success) { // Database \
    validatedEntries.data.map((entry) => {
      console.log(entry);
      
    })
  }
    //console.log(incomeEntries.map((entry: IncomeEntryDTO) => entry.name));
}

export const updateIncomeRecord = async (data: IncomeRecordProps) => {
  console.log(data);
}
  
export const getMemberId = async (name: string) => {
  const result = await db.members.findFirst({ 
    select: { id: true },
    where: { name_full: name}
  });
  
  return result;
}

export const getMemberName = async (id: number): Promise<string> => {
  if(!id) return "ID is not valid";
  
  try {
    const member = await db.members.findFirst({
      select: { name_full: true },
      where: { id }
    });

    return member?.name_full ?? "Member not found"
  } catch (e) {
    console.log("Query has been failed: ", e);
    return "error occurred";
  }  
}

export const memberCreateNoneExistName = async (name: string): Promise<number|null> => {
  if(!name || name == '') {
    return null
  }

  const member = await db.members.findFirst({
    select: {
      id: true
    },
    where: {
      name_full: name
    }
  });

  let mid: number | null = member?.id ?? null;

  if(mid == null) {
    const result = await db.members.create({
      data: {
        name_full: name
      }
    });

    mid = result.id;    
  }

  return mid;
}
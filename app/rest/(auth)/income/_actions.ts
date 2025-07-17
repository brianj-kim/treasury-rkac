import { IncomeEntryDTO } from "@/app/income/_components/income-form";
import db from "@/db/db";
import { revalidatePath } from "next/cache";

export type IncomeList = {
  id: number;
  name: string;
  type: string | null;
  method: string | null;  
  amount: number;
  notes: string | null;
  month: number;
  qt: number;
}

export const getMemberId = async (name: string): Promise<number | null> => {
  let result: number | null = null;
  const exists = await db.members.findFirst({ select: {id: true}, where: {name_full: name}});

  if( exists !== null ) result = exists.id;
  return result;
}

export const createMember = async (name: string) => {
  const result = await db.members.create({
    data: {
      name_full: name
    }
  });

  return result;
}

export const createIncome = async (entry: IncomeEntryDTO) => {
  const result = await db.income.create({
    data: {
      incType: entry.type,
      incMethod: entry.method,
      amount: entry.amount,
      member: entry.mid,
      notes: entry.notes,
      year: entry.year,
      month: entry.month,
      day: entry.day,
      qt: Math.ceil(entry.month!/3)
    }
  });

  return result;
}

export const getIncomeList = async (year: number, month: number): Promise<IncomeList[]> => {
  const result = await db.income_list.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      method: true,
      notes: true,
      amount: true,
      year: true,
      month: true,
      day: true,
      qt: true
    },
    where: { year, month },
    orderBy: [ 
      { day: 'desc' }
    ]
  });

  //console.log(result);
  return result;
}

export const deleteIncomeEntry = async (id: number) => {
  try {
    await db.income.delete({
      where: { id }
    });

    revalidatePath('/income');
    return 1; // successful to delete
  } catch (e) {
    console.error(`Failed to delete income entry with ID ${id}:`,e);
    return 0; // failed to delete
  }
  
}
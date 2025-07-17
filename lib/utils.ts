import { IncomeMethod, IncomeType } from "@/app/income/create/page"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTypeName = (idx: number, items: IncomeType[]) => {
  const foundType = items.find((item: IncomeType) => item.id === idx)
  return foundType ? foundType.name : undefined;
}

export const getMethodName = (idx: number, items: IncomeMethod[]) => {
  const foundMethod = items.find((item: IncomeMethod) => item.id === idx);
  return foundMethod ? foundMethod.name : undefined;
}

export const getQuarter = (month: string) => {
  return Math.ceil(parseInt(month)/3)
}
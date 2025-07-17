'use server'

import db from "@/db/db"
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from 'zod';

const addSchema = z.object({
  name_full: z.string().min(1),
  name_detail: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  postal: z.string()
});

export const addMember = async (prevState: unknown, formData: FormData) => {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  //console.log(result, result.error);

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await db.members.create({
    data: {
      name_full: data.name_full,
      name_detail: data.name_detail,
      address: data.address,
      city: data.city,
      province: data.province,
      postal: data.postal
    }
  });

  revalidatePath('/');
  revalidatePath('/members');

  redirect('/members');
}

export const updateMember = async (
  id: number,
  prevState: unknown,
  formData: FormData
) => {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }
  
  const data = result.data;
  const member = await db.members.findUnique({ where: { id }});

  if (member === null) return notFound();

  await db.members.update({
    where: { id },
    data: {
      name_full: data.name_full,
      name_detail: data.name_detail,
      address: data.address,
      city: data.city,
      province: data.province,
      postal: data.postal
    }
  });

  revalidatePath('/');
  revalidatePath('/members');

  redirect('/members');
}

export const deleteMember = async (id: number) => {
  const member = await db.members.delete({ where: { id }});

  if (member === null) return notFound();

  revalidatePath('/');
  revalidatePath('/members');
}

export const checkNameExist = async (name: string): Promise<number | null> => {
  const result = await db.members.findFirst({
    select: {
      id: true
    },
    where: {
      name_full: name
    }
  });

  return result?.id ?? null
}

export const createMemberWithName = async (name: string) => {
  const result = db.members.create({
    data: {
      name_full: name
    }
  })

  return result;
}
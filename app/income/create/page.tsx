'use server'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import IncomeForm from '../_components/income-form';
import db from '@/db/db';

export type Member = {
  id: number;
  name_kFull: string | null;
}

export type IncomeType = {
  id: number;
  name: string | null;
  detail: string | null;
}

export type IncomeMethod = {
  id: number;
  name: string | null;
  detail: string | null;
}

export type Note = {
  id: number;
  content: string;
}

const NewIncomePage = async () => {
  const incomeTypes: IncomeType[] = await db.category.findMany({
      select: {
        id: true,
        name: true,
        detail: true
      },
      where: { range : 'inc' },
      orderBy: { order: 'asc'}
    });

    const incomeMethods: IncomeMethod[] = await db.category.findMany({
      select: {
        id: true, 
        name: true,
        detail: true
      },
      where: { range: 'imd' },
      orderBy: { order: 'asc'}
    })

    const members: Member[] = await db.member.findMany({
      select: {
        id: true,
        name_kFull: true
      },
      orderBy: { id: 'desc' }
    });

  return (
    <section className='mt-24 container max-w-8xl'>
      <div className='my-3'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/income">Income</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/income/create">create</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>      
      <IncomeForm 
        incomeTypes={incomeTypes}
        incomeMethods={incomeMethods}
        members={members}
      />
    </section>
  );
}

export default NewIncomePage;
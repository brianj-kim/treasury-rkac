import PageHeader from '@/components/page-header';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import db from '@/db/db';
import React from 'react';
import { IncomeType } from '../../create/page';
import IncomeRecordEditForm from '../../_components/record-edit-form';
import { getMemberName } from '@/actions/income';

export type IncomeRecordProps = {
  id: number | null,
  type: number | null,
  amount: number | null,
  member?: number | null,
  year: number | null,
  month: number | null,
  day: number | null,
  notes: string | null,
  memberName?: string | null
}

const IncomeEditPage = async ({
  params: { id }
}: {params: { id: string }}) => {

  const incomeEntry = await db.income.findUnique({
    where: { id: parseInt( id ) }
  });

  const memberName = await getMemberName(incomeEntry!.member!);

  const incomeTypes: IncomeType[] = await db.category.findMany({
    select: {
      id: true,
      name: true,
      detail: true
    },
    where: { range : 'inc' },
    orderBy: { order: 'asc'}
  });

  const editIncomeRecord: IncomeRecordProps = {
    id: incomeEntry!.id,
    type: incomeEntry!.type,
    amount: incomeEntry!.amount,
    member: incomeEntry!.member,
    year: incomeEntry!.year,
    month: incomeEntry!.month,
    day: incomeEntry!.day,    
    notes: incomeEntry!.notes
  }
  // console.log( incomeEntry );
  return (
    <section className='container max-w-8xl mt-24'>
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
              <BreadcrumbLink href={`/income/${id}/edit`}>Edit</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
              
      <PageHeader>Income Record Edit</PageHeader>
      <IncomeRecordEditForm incomeRecord={editIncomeRecord} incomeTypes={incomeTypes} memberName={memberName} />
    </section>
  );
}

export default IncomeEditPage;
import PageHeader from '@/components/page-header';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import React from 'react';
import IncomeList from '../_components/income-list';

const IncomeEntriesPage = () => {
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
            <BreadcrumbLink href="/income/entries">Entries</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
            
    <PageHeader>Income Entries</PageHeader>
    <IncomeList />      
  </section>
  );
}

export default IncomeEntriesPage;
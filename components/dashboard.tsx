import React from 'react';
import { merriweather } from '@/components/fonts';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  return (
    <section className='flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-24 md:flex-row md:items-center'>
      <div className='mt-2 flex-1 md:mt-0'>
        <h1 className={cn(
          'title no-underline text-xl',
          merriweather.className
        )}>Regina Korean Alliance Church Finance Management System</h1>
        
      </div>
      
    </section>
  );
}

export default Dashboard;
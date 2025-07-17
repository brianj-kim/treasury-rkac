import React, { ReactNode } from 'react';
import { merriweather } from '@/components/fonts';
import { cn } from '@/lib/utils';

const PageHeader = ({ children }: { children: ReactNode }) => {
  return (
    <h1 
      className={cn(
        'title no-underline text-lg',
        merriweather.className
      )}
    >
      {children}
    </h1>
  );
}

export default PageHeader;
'use client'

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ComponentProps, ReactNode } from 'react';

const Nav = ({ children }: { children: ReactNode }) => {
  return (
    <nav className='text-primary-background flex justify-center px-4'>
      {children}
    </nav>
  );
}

export const NavLink = (props: Omit<ComponentProps<typeof Link>, 'className'>) => {
  const pathname = usePathname();
  const isActive: boolean = pathname.startsWith(props.href as string);
  return (
    <Link
      {...props}
      className={cn(
        'px-4 py-2 hover:bg-primary hover:text-primary-foreground hover:rounded-t-md foucs-visible:bg-primary focus-visible:text-primary-foreground',
        isActive && 'bg-foreground text-background rounded-t-md'
      )}
    />
  )
}

export default Nav;


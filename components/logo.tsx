import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';

const Logo = () => {
  return (
    <div 
    className={cn(
      'flex flex-col font-merriweather antialiased'
      )}
    >
      <Link href='/' className='text-2xl font-bold'>
        <p className='text-xs font-manrope'>RKAC</p>
        <p className='text-lg font-manrope'>Finance</p>
      </Link>
    </div>
  );
}

export default Logo;
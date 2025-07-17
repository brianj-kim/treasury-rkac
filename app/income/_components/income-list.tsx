// 'use client'

// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { formatCurrency } from '@/lib/formatters';
// import Link from 'next/link';

// import React, { useEffect, useState } from 'react';
// import { DataTable } from './data-table';
// import { columns } from './columns';
// import { useRouter } from 'next/navigation';

// export type IncomeRes = {
//   id: number,
//   type: string,
//   method: string,
//   name: string,
//   amount: number,
//   notes?: string | null,
//   year: number,
//   month: number,
//   day: number,
//   qt: number
// }

// const IncomeList = () => {
//   const route = useRouter();
//   const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
//   const [incomeList, setIncomeList] = useState<IncomeRes[]>([]);  
//   const [totalAmount, setTotalAmount] = useState<number>(0);
//   const currentYear = new Date().getFullYear();

//   const handleYearChange = (year: string) => {
//     setSelectedYear(parseInt(year));
//   }
  
//   const handleOnUpdate = (id: number) => {
//     route.push(`/income/${id}/edit`);
//   }

//   const handleRemove = async (id: number, amount: number) => {
//     try {
//       const res = await fetch(process.env.NEXT_PUBLIC_REST_URL+'/income', {
//         method: 'DELETE',
//         body: JSON.stringify({ id }),
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
  
//       if(!res.ok) {
//         throw new Error(`Failed to delete income entry with ID ${id}`);
//       }
          
//       const data = await res.json();
//       console.log('Income entry deleted:', data);  

//       // Remove the entry in the state of incomeList
//       const removedIncomeList = incomeList.filter(item => item.id !== id);
//       setIncomeList(removedIncomeList);

//       setTotalAmount((prev) => prev - amount);

//     } catch (e: unknown) {
//       console.error('Error in delete request: ', e);
//     }    
//   }

//   useEffect(() => {
//     const url = new URL(process.env.NEXT_PUBLIC_REST_URL+'/income');
//     const param = { 'year': selectedYear.toString(), 'month': selectedMonth.toString()};

//     url.search = new URLSearchParams(param).toString();  

//     const fetchIncome = async () => await fetch(url, {
//       method: 'GET'      
//     })
//     .then(res => res.json())
//     .then(data => {
//       //console.log(data)
//       setIncomeList(data);

//     })    
//     .catch((err) => console.error('Error', err));

//     fetchIncome();
//   },[selectedYear, selectedMonth]);

//   useEffect(() => {
//     const total = incomeList.reduce((acc, income) => acc + income.amount, 0);
//     setTotalAmount(total);
//   },[incomeList]);

//   return (
//     <div>
//       <div className='flex justify-between mt-4'>
//         <div className="flex items-center">  
//           <span className='text-sm pr-3'>Income Record for</span>
//           <Select onValueChange={handleYearChange}>
//             <SelectTrigger className="w-[90px]">
//               <SelectValue placeholder={currentYear} />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 <SelectLabel>Select a year</SelectLabel>
//                 {Array.from({ length: 5 }, (_, i) => (
//                   <SelectItem key={i} value={(currentYear - i).toString()}>{currentYear - i}</SelectItem>                
//                 ))}              
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Button asChild className='mb-2'>
//             <Link href="/income/new">Add Income</Link>
//           </Button>
//         </div>        
//       </div>

//       <div>
//         <div className='my-3'>
//           <span className='text-sm'>Count: <span className='text-lg font-semibold pr-6'>{incomeList.length}</span></span>
//           <span className='text-sm'>Total: <span className='text-lg font-semibold pl-3'>{formatCurrency(totalAmount / 100)}</span></span>
//         </div>
        
//         <div>          
//           <DataTable columns={columns(handleOnUpdate, handleRemove)} data={incomeList} />
          
//         </div>
//       </div>
//     </div>
//   );
// }

// export default IncomeList;

'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { DataTable } from './data-table';
import { columns } from './columns';
import { formatCurrency } from '@/lib/formatters';

export type IncomeRes = {
  id: number;
  type: string;
  method: string;
  name: string;
  amount: number;
  notes?: string | null;
  year: number;
  month: number;
  day: number;
  qt: number;
};

const PAGE_SIZE = 10; // or whatever size you want per page

const IncomeList = () => {
  const router = useRouter();

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [incomeList, setIncomeList] = useState<IncomeRes[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [page, setPage] = useState<number>(1);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const currentYear = new Date().getFullYear();

  /**
   * When any filter or search changes, reset pagination & data
   */
  useEffect(() => {
    setPage(1);
    setIncomeList([]);
    setHasMoreData(true);
  }, [selectedYear, selectedMonth, searchTerm]);

  /**
   * Fetch data whenever page changes
   */
  useEffect(() => {
    // If there's no more data, do not fetch
    if (!hasMoreData && page !== 1) return;

    const fetchData = async () => {
      try {
        const url = new URL(process.env.NEXT_PUBLIC_REST_URL + '/income');

        // Example query parameters:
        // year, month, search, page, limit
        const params = {
          year: selectedYear.toString(),
          month: selectedMonth.toString(),
          search: searchTerm,
          page: page.toString(),
          limit: PAGE_SIZE.toString(),
        };
        url.search = new URLSearchParams(params).toString();

        const res = await fetch(url.toString(), { method: 'GET' });
        if (!res.ok) {
          throw new Error(`Failed to fetch income list. Status: ${res.status}`);
        }

        const data: IncomeRes[] = await res.json();

        // If we get fewer than PAGE_SIZE items, it means no more data (*)
        if (data.length < PAGE_SIZE) {
          setHasMoreData(false);
        }

        // For page=1, replace; otherwise, append
        setIncomeList((prev) => (page === 1 ? data : [...prev, ...data]));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page, hasMoreData, selectedYear, selectedMonth, searchTerm]);

  /**
   * Calculate total when incomeList changes
   */
  useEffect(() => {
    const total = incomeList.reduce((acc, income) => acc + income.amount, 0);
    setTotalAmount(total);
  }, [incomeList]);

  /**
   * Intersection Observer for infinite scrolling
   * If the "sentinel" is visible, increment the page.
   */
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      // Disconnect any existing observer
      observerRef.current?.disconnect();

      // (**) If no more data, do not observe
      if (!hasMoreData) return;

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreData) {
          // Increase page to load more
          setPage((prevPage) => prevPage + 1);
        }
      });

      observerRef.current.observe(node);
    },
    [hasMoreData]
  );

  /**
   * If `hasMoreData` becomes false, we can also disconnect the observer (***)
   */
  useEffect(() => {
    if (!hasMoreData) {
      observerRef.current?.disconnect();
    }
  }, [hasMoreData]);

  /**
   * Handlers
   */
  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year, 10));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOnUpdate = (id: number) => {
    router.push(`/income/${id}/edit`);
  };

  const handleRemove = async (id: number, amount: number) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_REST_URL + '/income', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to delete income entry with ID ${id}`);
      }

      // remove from state
      setIncomeList((prev) => prev.filter((item) => item.id !== id));

      // adjust total
      setTotalAmount((prev) => prev - amount);
    } catch (e: unknown) {
      console.error('Error in delete request: ', e);
    }
  };

  return (
    <div>
      <div className="flex justify-between mt-4 items-center">
        <div className="flex items-center">
          <span className="text-sm pr-3">Income Year for</span>
          <Select onValueChange={handleYearChange}>
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder={currentYear} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a year</SelectLabel>
                {Array.from({ length: 5 }, (_, i) => (
                  <SelectItem key={i} value={(currentYear - i).toString()}>
                    {currentYear - i}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>          
        </div>

        <div>
          {/* Month selection */}
          <div className="mb-2 flex space-x-2 justify-end">
            {[...Array(12)].map((_, i) => {
              const m = i + 1;
              return (
                <Button
                  key={m}
                  size="tab"
                  variant={m === selectedMonth ? 'default' : 'outline'}
                  onClick={() => setSelectedMonth(m)}
                >
                  {m}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <Button asChild className="mb-2">
            <Link href="/income/new">Add Income</Link>
          </Button>
        </div>
      </div>

      {/* Simple search input */}
      <div className="mt-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search income..."
          className="border p-2 rounded w-full md:w-1/2"
        />
      </div>

      <div>
        <div className="my-3">
          <span className="text-sm">
            Count:{' '}
            <span className="text-lg font-semibold pr-6">{incomeList.length}</span>
          </span>
          <span className="text-sm">
            Total:{' '}
            <span className="text-lg font-semibold pl-3">
              {formatCurrency(totalAmount / 100)}
            </span>
          </span>
        </div>

        

        <DataTable columns={columns(handleOnUpdate, handleRemove)} data={incomeList} />

        {/* Sentinel div for IntersectionObserver */}
        {hasMoreData ? (
          <div ref={lastItemRef} className="h-10 flex items-center justify-center">
            <span>Loading more...</span>
          </div>
        ) : (
          <div className="text-center my-4 text-sm text-gray-500">
            No more data to load.
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeList;

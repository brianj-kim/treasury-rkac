import PageHeader from '@/components/page-header';
import db from '@/db/db';
import { formatCurrency } from '@/lib/formatters';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreVertical } from 'lucide-react';
import React from 'react';
import { DeleteDropdownItem } from './_components/member-actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export type MemberWithStats = {
  id: number
  name_full?: string | null
  name_detail?: string | null
  offer_count: number
  total_amount: number
}

const getMembersWithOfferStats = async (): Promise<MemberWithStats[]> => {
  const members = await db.members.findMany({
    select: {
      id: true,
      name_full: true,
      name_detail: true,
    },
    orderBy: { name_full: 'asc'}
  });

  const incomeStats = await db.income.groupBy({
    by:['member'],
    _count: {
      id: true
    },
    _sum: {
      amount: true
    }
  });

  const memberWithIncomeStats = members.map((member) => {
    const stats = incomeStats.find((stat) => stat.member === member.id);
    return {
      ...member,
      offer_count: stats?._count?.id || 0,
      total_amount: stats?._sum?.amount || 0,
    };
  });

  return memberWithIncomeStats;
}

const MembersPage = () => {
  return (
    <section className="pt-24">
      <div className="container max-w-4xl ">
        <PageHeader>Members</PageHeader>
        <div className='flex justify-end '>
          <Button asChild className='mb-2'>
            <Link href="/members/new">Add Member</Link>
          </Button>
        </div>
        <MembersTable />
      </div>
    </section>
  );
}

const MembersTable = async () => {
  const members = await getMembersWithOfferStats();

  if (!members) return <p>No Members Found</p>
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name </TableHead>
          <TableHead>Name Detail</TableHead>
          <TableHead>Offer Count</TableHead>
          <TableHead>Offer Total</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody >
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{member.name_full}</TableCell>
            <TableCell>{member.name_detail}</TableCell>
            <TableCell>{member.offer_count}</TableCell>
            <TableCell>
              {formatCurrency(member.total_amount / 100)}
            </TableCell>
            <TableCell className='text-center'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className='sr-only'>Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/members/${member.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem id={member.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default MembersPage;
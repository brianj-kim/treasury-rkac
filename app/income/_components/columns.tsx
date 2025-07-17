'use client'

import { ColumnDef } from "@tanstack/react-table"
import { IncomeRes } from "./income-list"
import { formatCurrency } from "@/lib/formatters"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

export const columns = (
  onUpdate: (id: number) => void,
  onDelete: (id: number, amount: number) => void
): ColumnDef<IncomeRes>[] => [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({row}) => {
      const formattedDate = row.original.year.toString() + '-' + ('0' + row.original.month.toString()).slice(-2) + '-' + ('0' + row.original.day.toString()).slice(-2)
      return <div>{formattedDate}</div>
    },
    size: 60
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'type',
    header: 'Type'
  },
  {
    accessorKey: 'amount',
    header: () => <div>Amount</div>,
    cell: ({row}) => {      
      const amount = formatCurrency(parseInt(row.getValue('amount')) / 100)
      return <div className='text-md'>{amount}</div>
    }
  },
  {
    accessorKey: 'method',
    header: 'Method'
  },
  {
    accessorKey: 'notes',
    header: 'Note'
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      
      const income = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical />
            <span className='sr-only'>Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onUpdate(income.id)}>
              Update
            </DropdownMenuItem>
            <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-red-500 font-semibold'
                onClick={() => onDelete(income.id, income.amount)}
              >
                  Delete
              </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

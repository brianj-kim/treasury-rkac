'use client'

import { deleteMember } from "@/actions/members";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react"

export const DeleteDropdownItem = ({ id }: { id: number }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem 
      className='destructive'
      disabled={isPending}
      onClick={() => 
        startTransition(async () => {
          await deleteMember(id)
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  )
}
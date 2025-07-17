
import { checkNameExist, createMemberWithName } from "@/actions/members";
import db from "@/db/db";
import { getQuarter } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();    
    let mid = body.member_origin;
    let result = null;

    if(await checkNameExist(body.memberName) == null) {
      const newMember = await createMemberWithName(body.memberName)
      mid = newMember.id;
    }

    // Update Income Record
    result = await db.income.update({
      data: {
        member: mid,
        type: body.type,
        amount: body.amount,
        notes: body.notes,
        year: body.year,
        month: body.month,
        day: body.day,
        qt: getQuarter(body.month)
      },
      where: {
        id: body.id
      }
    });

    return new NextResponse(
      JSON.stringify({ message: "Succeed to create records on the tables", result})
    )
  } catch (e: unknown) {
    return new NextResponse("Error occured" + e, {
      status: 500
    });
  }
}
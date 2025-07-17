import { NextResponse } from 'next/server';
import { createIncome, createMember, deleteIncomeEntry, getIncomeList, getMemberId, IncomeList} from './_actions';
import { checkNameExist, createMemberWithName } from '@/actions/members';
import db from '@/db/db';
import { getQuarter } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
// TODO: Later it will be required to implement middleware for JWT so on.
//

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    let incomeList: IncomeList[] = [];

    if(typeof year === 'string' && typeof month === 'string') incomeList = await getIncomeList(parseInt(year), parseInt(month));

    return new NextResponse(JSON.stringify(incomeList), { status: 200 });
  } catch(e: unknown) {
    return new NextResponse("Error occured: " + e, {
      status: 500
    });
  }  
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    for(const entry of body) { 
      let id = await getMemberId(entry.name);
      if(!id) {
        const newMember = await createMember(entry.name);
        id = newMember.id;
      }      
      entry.mid = id;

      const createdIncome = await createIncome(entry);
      if(!createdIncome) {
        return NextResponse.json(
          { error: 'Failed to create Income entry.' },
          { status: 400 },
        );
      }
    }

    revalidatePath('/');
    revalidatePath('/income');

    return NextResponse.json(
      { success: true, message: 'Income entry(ies) created.' },
      { status: 201 },
    );
  } catch (e: unknown) {
    return new NextResponse("Error occured" + e, {
      status: 500,
    });
  }
}

export const PATCH = async (req: Request) => {
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
        incType: body.incType,
        incMethod: body.incMethod,
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

    return NextResponse.json({
      message: "Succeed to update records on the tables", 
      result
    });
  } catch (e: unknown) {
    console.error('Error in PATCH request: ', e);
    return new NextResponse("Error occured: " + String(e), { status: 500 });
  }
}


export const DELETE = async (req: Request) => {
  try {
    const body = await req.json();

    // console.log(body);
    const result = await deleteIncomeEntry(body.id);
    return NextResponse.json({
      message: "Succeed to delete a record on income table", 
      result
    })
  } catch (e: unknown) {
    console.error('Error in DELETE request: ', e);
    return new NextResponse("Error occured: " + String(e), { status: 500 });
  }
}
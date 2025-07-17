import db from "@/db/db";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');

  const selectedYear = Number(year);

  if (isNaN(selectedYear)) {
    return new NextResponse("Error occured: ", {
      status: 400
    });
  }

  try {
    const data = await db.income.groupBy({
      by: ['incType', 'month'],
      _sum: {
        amount: true,
      },
      orderBy: {
        incType: 'asc',
      },
      where: {
        year: selectedYear,
      },
    });

    const incomeType = await db.categories.findMany({
      where: {
        range: 'inc',
      },
      select: {
        id: true,
        name: true,
        detail: true
      }
    });

    const incomeMethod = await db.categories.findMany({
      where: {
        range: 'imd',
      },
      select: {
        id: true,
        name: true,
        detail: true
      }
    })

    return new NextResponse(JSON.stringify({data, incomeType, incomeMethod}), { status: 200 });
  } catch (e) {
    return new NextResponse("Error occured: " + e, {
      status: 500
    });
  }
};
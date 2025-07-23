'use client'

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { useEffect, useState } from "react";

type DataItem = {
  incType: number;
  method?: number;
  month: number | null;
  _sum: {
    amount: number | null;
  };
}

type Category = {
  id: number;
  name: string;
}

const IncomeDashboard = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [data, setData] = useState<DataItem[]>([]);
  const [incTypes, setIncType] = useState<Category[]>([]);
  // const [incMethods, setIncMethod] = useState<Category[]>([]);
  // const [ categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_REST_URL}/income/dashboard/?year=${selectedYear}`);
        const json = await res.json();
        const { data, incomeType } = json;

        setData(data);
        setIncType(incomeType);
        // setIncMethod(incomeMethod);
        // setCategories(categories);
      } catch (e) {
        console.error('Error fetching data: ', e);
      }
      setLoading(false);
    };

    fetchData();
  },[selectedYear]);

  const typeMap = incTypes.reduce((acc, type) => {
    const typeName = type.name;
    acc[type.id] = typeName;

    return acc;
  }, {} as Record<number, string>);

  const rows = incTypes.map((type) => ({
    incType: type.name,
    total: 0,
    month: Array(12).fill(0),
  }));

  data.forEach((item) => {
    //const type = item.type;
    // const method = item.method;

    if (item.incType === null) return;

    const typeName = typeMap[item.incType];
    // const methodName = methodMap[method];
    const monthIndex = (item.month ?? 1) - 1;
    const row = rows.find((row) => row.incType === typeName);

    if (row) {
      const amount = item._sum.amount || 0;
      row.month[monthIndex] = amount;
      row.total += amount;
    }
  });

  const monthlyTotals = Array(12).fill(0);
  let grandTotal = 0;

  rows.forEach((row) => {
    row.month.forEach((amount, index) => {
      monthlyTotals[index] += amount;
      grandTotal += amount;
    });
  });

  // Calculate overall quarterly totals
  const quarterlyTotals = [0, 0, 0, 0];

  for (let i = 0; i < 4; i++) {
    const startMonth = i * 3;
    const quarterSum = monthlyTotals
      .slice(startMonth, startMonth + 3)
      .reduce((sum, amount) => sum + amount, 0);
    quarterlyTotals[i] = quarterSum;
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const minYear = currentYear - 5;
  const maxYear = currentYear;
  const yearOptions = [];
  for (let y = maxYear; y >= minYear; y--) {
    yearOptions.push(y);
  }

  return (
    <div>
      <div className="my-4 flex justify-between">
        <div>
          <label htmlFor="year-select" className="mr-2 font-bold">
            Select Year:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded p-2"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div >
          <Button asChild className='mb-2 mr-2'>
            <Link href="/income/create">Add Income</Link>
          </Button>

          <Button asChild className='mb-2'>
            <Link href="/income/entries">Income List</Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="overflow-x-auto mt-6 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell></TableCell>
                {monthNames.map((monthName) => (
                  <TableHead key={monthName} className="text-center">
                    {monthName}
                  </TableHead>
                ))}
                <TableHead className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.incType}</TableCell>
                  {row.month.map((amount, monthIndex) => (
                    <TableCell key={monthIndex} className="text-center">
                      {formatCurrency(amount / 100)}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    {formatCurrency(row.total / 100)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold">Monthly <br/>Total</TableCell>
                {monthlyTotals.map((amount, index) => (
                  <TableCell key={index} className="text-center font-bold">
                    {formatCurrency(amount / 100)}
                  </TableCell>
                ))}
                <TableCell className="text-center font-bold">
                  {formatCurrency(grandTotal / 100)}
                </TableCell>
              </TableRow>

              {/* Quarterly Total Row */}
              <TableRow>
                <TableCell className="font-bold" rowSpan={2}>Quarterly <br/>Total</TableCell>
                <TableCell colSpan={3} className="text-center font-bold">Q1</TableCell>
                <TableCell colSpan={3} className="text-center font-bold">Q2</TableCell>
                <TableCell colSpan={3} className="text-center font-bold">Q3</TableCell>
                <TableCell colSpan={3} className="text-center font-bold">Q4</TableCell>
                <TableCell className="text-center font-bold">Grand <br/>Total</TableCell>
              </TableRow>
              <TableRow>
                
                {quarterlyTotals.map((amount, index) => (
                  <TableCell
                    key={`quarter-total-${index}`}
                    colSpan={3}
                    className="text-center font-bold"
                  >
                    {formatCurrency(amount / 100)}
                  </TableCell>
                ))}
                <TableCell className="text-center font-bold text-lg text-blue-700">
                  {formatCurrency(grandTotal / 100)}
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default IncomeDashboard;

import PageHeader from '@/components/page-header';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

import IncomeDashboard from './_components/income-dashboard';

const IncomePage = async () => {
    //console.log(new Date().getFullYear() );
  // const currentYear = new Date().getFullYear();

  // const data = await db.income.groupBy({
  //   by: ['type', 'month'],
  //   _sum: {
  //     amount: true
  //   },
  //   orderBy: {
  //     type: 'asc',
  //   },
  //   where: {
  //     year: currentYear
  //   }
  // });  

  // const categories = await db.categories.findMany({
  //   where: {
  //     range: 'inc',
  //   },
  //   select: {
  //     id: true,
  //     name: true
  //   }
  // });

  // const categoryMap = categories.reduce((acc, category) => {
  //   const categoryName = category.name ?? 'Unnamed Offer Type';
  //   acc[category.id] = categoryName;

  //   return acc;
  // }, {} as Record<number, string>);

  // const rows = categories.map((category) => ({
  //   category: category.name,
  //   total: 0,
  //   month: Array(12).fill(0)
  // }));

  // data.forEach((item) => {
  //   const type = item.type;

  //   if (type === null) return;

  //   const categoryName = categoryMap[type];
  //   const monthIndex = item.month! - 1;
  //   const row = rows.find((row) => row.category === categoryName);

  //   if (row) {
  //     const amount = item._sum.amount || 0;
  //     row.month[monthIndex] = amount;
  //     row.total += amount;
  //   }
  // });

  // // Calculate monthly totals and grand total
  // const monthlyTotals = Array(12).fill(0);
  // let grandTotal = 0;

  // rows.forEach((row) => {
  //   row.month.forEach((amount, index) => {
  //     monthlyTotals[index] += amount;
  //     grandTotal += amount;
  //   });
  // });

  // const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <section className='container max-w-8xl mt-24'>
      <div className='my-3'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/income">Income</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
              
      <PageHeader>Income - Dashboard</PageHeader>

      <IncomeDashboard />
       
      
    </section>
  );
}

export default IncomePage;
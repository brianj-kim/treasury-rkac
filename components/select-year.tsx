import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type Props = {
  year: number;
  setYear: (year:number) => void;
}

const SelectYear = ({year, setYear}: Props) => {  
  const currentYear = new Date().getFullYear();
  const lastFiveYears = Array.from({ length: 5}, (_, index) => currentYear - index); // Showing last 5 years list
    
  const handleYearChange = (newYear: string) => {  
    const selectedYear = parseInt(newYear, 10);
    if (!isNaN(selectedYear)) {
      setYear(selectedYear);
    }
    
  };
  
  return (

    <div >
      <Select value={year.toString()}  onValueChange={handleYearChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={year.toString()} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>  
            {lastFiveYears.map(currentYear => (
              <SelectItem key={currentYear} value={currentYear.toString()}>
                {currentYear}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectYear;
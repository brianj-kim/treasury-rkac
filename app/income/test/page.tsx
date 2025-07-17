'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { format, startOfWeek, addDays } from 'date-fns';

export default function IncomeEntryPage() {
  const [date, setDate] = useState(() => {
    const today = new Date();
    const sunday = addDays(startOfWeek(today, { weekStartsOn: 1 }), 6); // Sunday of current week
    return format(sunday, 'yyyy-MM-dd');
  });

  const [items, setItems] = useState([{ category: '', amount: '' }]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index][field as 'category' | 'amount'] = value;
    setItems(updated);
  };

  const addRow = () => setItems([...items, { category: '', amount: '' }]);

  const handleSubmit = async () => {
    await fetch('/api/income', {
      method: 'POST',
      body: JSON.stringify({ date, items }),
      headers: { 'Content-Type': 'application/json' },
    });
    alert('Income recorded!');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Weekly Income Entry</h1>

      <div className="space-y-2">
        <Label htmlFor="date">Date (Sunday)</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {items.map((item, index) => (
        <Card key={index} className="mt-4">
          <CardContent className="grid grid-cols-2 gap-4 p-4">
            <div>
              <Label>Category</Label>
              <Input
                placeholder="e.g., Tithes, Offering"
                value={item.category}
                onChange={(e) => handleChange(index, 'category', e.target.value)}
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="e.g., 100"
                value={item.amount}
                onChange={(e) => handleChange(index, 'amount', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addRow} variant="outline">+ Add Row</Button>
      <Button onClick={handleSubmit} className="ml-2">Submit Income</Button>
    </div>
  );
}

import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface ManualBudgetProps {
  onComplete: () => void;
}

const ManualBudget = ({ onComplete }: ManualBudgetProps) => {
  const { addBudgetCategory } = useFinance();
  const [categories, setCategories] = useState<Array<{ name: string; amount: string }>>([
    { name: '', amount: '' }
  ]);

  const handleAddCategory = () => {
    setCategories([...categories, { name: '', amount: '' }]);
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    categories.forEach(cat => {
      if (cat.name && cat.amount) {
        addBudgetCategory({
          name: cat.name,
          budgetAmount: parseFloat(cat.amount),
        });
      }
    });

    onComplete();
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor={`name-${index}`}>Category Name</Label>
                <Input
                  id={`name-${index}`}
                  value={category.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="e.g., Groceries, Entertainment"
                  required
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`amount-${index}`}>Budget Amount (₹)</Label>
                <Input
                  id={`amount-${index}`}
                  type="number"
                  step="0.01"
                  value={category.amount}
                  onChange={(e) => handleChange(index, 'amount', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              {categories.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCategory(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddCategory}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>

        <Button type="submit" className="w-full" size="lg">
          Create Budget
        </Button>
      </form>
    </Card>
  );
};

export default ManualBudget;

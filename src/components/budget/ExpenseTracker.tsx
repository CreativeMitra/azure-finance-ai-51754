import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/formatters';
import { format } from 'date-fns';

const ExpenseTracker = () => {
  const { budgetCategories, expenses, addExpense, updateExpense, deleteExpense } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExpense) {
      updateExpense(editingExpense.id, {
        name: formData.name,
        amount: parseFloat(formData.amount),
        category: formData.category,
        notes: formData.notes,
      });
    } else {
      addExpense({
        name: formData.name,
        amount: parseFloat(formData.amount),
        category: formData.category,
        notes: formData.notes,
        date: new Date(),
      });
    }

    setFormData({ name: '', amount: '', category: '', notes: '' });
    setEditingExpense(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setFormData({
      name: expense.name,
      amount: expense.amount.toString(),
      category: expense.category,
      notes: expense.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Expense Tracker</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Edit' : 'Add'} Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingExpense ? 'Update' : 'Add'} Expense
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {expenses.slice().reverse().map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{expense.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-muted-foreground">{expense.category}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </span>
              </div>
              {expense.notes && (
                <p className="text-sm text-muted-foreground mt-1">{expense.notes}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-bold text-primary">{formatCurrency(expense.amount)}</p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(expense)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(expense.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {expenses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No expenses added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;

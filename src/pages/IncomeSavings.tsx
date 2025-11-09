import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/formatters';
import IncomeExpenseTracker from '@/components/income/IncomeExpenseTracker';
import SavingsSuggestions from '@/components/income/SavingsSuggestions';
import IncomeGrowthChart from '@/components/income/IncomeGrowthChart';

const IncomeSavings = () => {
  const { incomeSources, addIncomeSource, expenses, budgetSettings } = useFinance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly' as const,
    date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIncomeSource({
      name: formData.name,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      date: new Date(formData.date)
    });
    setFormData({
      name: '',
      amount: '',
      frequency: 'monthly',
      date: ''
    });
    setIsAddDialogOpen(false);
  };

  const totalMonthlyIncome = incomeSources.reduce((sum, income) => {
    if (income.frequency === 'monthly') return sum + income.amount;
    if (income.frequency === 'quarterly') return sum + (income.amount / 3);
    if (income.frequency === 'yearly') return sum + (income.amount / 12);
    return sum;
  }, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = totalMonthlyIncome - totalExpenses;
  const savingsRate = totalMonthlyIncome > 0 ? (totalSavings / totalMonthlyIncome) * 100 : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-success via-primary to-accent bg-clip-text text-transparent">
            Income & Savings
          </h1>
          <p className="text-muted-foreground mt-2">Track income flow and saving strategies</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Income Source
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Income Source</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Income Name</Label>
                <Input
                  id="name"
                  placeholder="Salary, Freelance, Rental"
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
                  placeholder="50000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Income Source</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
          <p className="text-sm text-muted-foreground mb-2">Monthly Income</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(totalMonthlyIncome)}</p>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
          <p className="text-sm text-muted-foreground mb-2">Total Expenses</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Total Savings</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(totalSavings)}</p>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <p className="text-sm text-muted-foreground mb-2">Savings Rate</p>
          <p className="text-3xl font-bold text-foreground">{savingsRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Income Growth Chart */}
      <IncomeGrowthChart incomeSources={incomeSources} />

      {/* Income & Expense Tracker */}
      <IncomeExpenseTracker incomeSources={incomeSources} expenses={expenses} />

      {/* Savings Suggestions */}
      <SavingsSuggestions savingsRate={savingsRate} totalSavings={totalSavings} />
    </div>
  );
};

export default IncomeSavings;

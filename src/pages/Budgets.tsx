import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Plus, Sparkles, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BudgetOverview from '@/components/budget/BudgetOverview';
import ManualBudget from '@/components/budget/ManualBudget';
import AIBudgetCreator from '@/components/budget/AIBudgetCreator';
import ExpenseTracker from '@/components/budget/ExpenseTracker';
import SpendingAnalysis from '@/components/budget/SpendingAnalysis';

const Budgets = () => {
  const { budgetCategories, expenses, resetBudget } = useFinance();
  const [activeTab, setActiveTab] = useState('overview');
  const [showBudgetCreator, setShowBudgetCreator] = useState(budgetCategories.length === 0);

  const handleResetBudget = () => {
    if (confirm('Are you sure you want to reset the budget? This will clear all spending but keep categories.')) {
      resetBudget();
    }
  };

  const handleDownloadReport = (period: 'monthly' | 'yearly') => {
    const filteredExpenses = expenses.filter(expense => {
      const now = new Date();
      const expenseDate = new Date(expense.date);
      
      if (period === 'monthly') {
        return expenseDate.getMonth() === now.getMonth() && 
               expenseDate.getFullYear() === now.getFullYear();
      } else {
        return expenseDate.getFullYear() === now.getFullYear();
      }
    });

    const csvContent = [
      ['Name', 'Amount', 'Category', 'Date', 'Notes'].join(','),
      ...filteredExpenses.map(e => 
        [e.name, e.amount, e.category, e.date.toISOString(), e.notes || ''].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (showBudgetCreator && budgetCategories.length === 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Create Your Budget</h1>
          
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Budget</TabsTrigger>
              <TabsTrigger value="ai">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Budget
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <ManualBudget onComplete={() => setShowBudgetCreator(false)} />
            </TabsContent>
            
            <TabsContent value="ai">
              <AIBudgetCreator onComplete={() => setShowBudgetCreator(false)} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Budget & Spending</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleResetBudget}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Budget
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownloadReport('monthly')}
            >
              <Download className="w-4 h-4 mr-2" />
              Monthly Report
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownloadReport('yearly')}
            >
              <Download className="w-4 h-4 mr-2" />
              Yearly Report
            </Button>
          </div>
        </div>

        {/* Budget Overview */}
        <BudgetOverview />

        {/* Spending Analysis */}
        <SpendingAnalysis />

        {/* Expense Tracker */}
        <ExpenseTracker />
      </div>
    </div>
  );
};

export default Budgets;

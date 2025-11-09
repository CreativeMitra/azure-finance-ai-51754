import { Card } from '@/components/ui/card';
import { IncomeSource, Expense } from '@/contexts/FinanceContext';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface IncomeExpenseTrackerProps {
  incomeSources: IncomeSource[];
  expenses: Expense[];
}

const IncomeExpenseTracker = ({ incomeSources, expenses }: IncomeExpenseTrackerProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income Sources */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-success/10">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">Income Sources</h3>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {incomeSources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No income sources added yet</p>
          ) : (
            incomeSources.map((income) => (
              <div key={income.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="font-medium text-foreground">{income.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {income.frequency}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">{formatCurrency(income.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(income.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Recent Expenses */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-destructive/10">
            <TrendingDown className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="font-semibold text-lg text-foreground">Recent Expenses</h3>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No expenses tracked yet</p>
          ) : (
            expenses.slice(0, 10).map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="font-medium text-foreground">{expense.name}</p>
                  <p className="text-xs text-muted-foreground">{expense.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-destructive">{formatCurrency(expense.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default IncomeExpenseTracker;

import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const BudgetOverview = () => {
  const { budgetCategories } = useFinance();

  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Budget */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm text-muted-foreground mb-2">Total Budget</h3>
        <p className="text-3xl font-bold text-foreground">{formatCurrency(totalBudget)}</p>
      </div>

      {/* Total Spent */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm text-muted-foreground mb-2">Total Spent</h3>
        <p className="text-3xl font-bold text-primary">{formatCurrency(totalSpent)}</p>
        <div className="mt-3">
          <Progress value={spentPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{formatPercentage(spentPercentage)} of budget</p>
        </div>
      </div>

      {/* Remaining */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm text-muted-foreground mb-2">Remaining</h3>
        <p className={`text-3xl font-bold ${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
          {formatCurrency(remaining)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {remaining >= 0 ? (
            <>
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm text-success">On track</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">Over budget</span>
            </>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="md:col-span-3 bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h3>
        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const percentage = category.budgetAmount > 0 ? (category.spent / category.budgetAmount) * 100 : 0;
            const isNearLimit = percentage >= 90;
            const isOverLimit = percentage > 100;

            return (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{category.name}</span>
                    {isNearLimit && (
                      <AlertCircle className="w-4 h-4 text-warning" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(category.spent)} / {formatCurrency(category.budgetAmount)}
                  </div>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-2 ${isOverLimit ? '[&>div]:bg-destructive' : isNearLimit ? '[&>div]:bg-warning' : ''}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;

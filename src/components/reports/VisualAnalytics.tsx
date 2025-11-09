import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Expense, IncomeSource, AssetLiability } from '@/contexts/FinanceContext';
import { PieChart } from 'lucide-react';

interface VisualAnalyticsProps {
  expenses: Expense[];
  incomeSources: IncomeSource[];
  assetsLiabilities: AssetLiability[];
}

const VisualAnalytics = ({ expenses, incomeSources, assetsLiabilities }: VisualAnalyticsProps) => {
  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    expenses: amount
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-accent/10">
          <PieChart className="w-5 h-5 text-accent" />
        </div>
        <h3 className="font-semibold text-lg text-foreground">Visual Analytics</h3>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">Expenses by Category</h4>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>No data to display</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="category" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border/30">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Total Categories</p>
            <p className="text-2xl font-bold text-foreground">{chartData.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
            <p className="text-sm text-muted-foreground mb-1">Income Sources</p>
            <p className="text-2xl font-bold text-foreground">{incomeSources.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm text-muted-foreground mb-1">Assets & Liabilities</p>
            <p className="text-2xl font-bold text-foreground">{assetsLiabilities.length}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VisualAnalytics;

import { Card } from '@/components/ui/card';
import { IncomeSource, Expense } from '@/contexts/FinanceContext';
import { FileText, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MonthlyReportProps {
  reportType: string;
  expenses: Expense[];
  incomeSources: IncomeSource[];
  totalIncome: number;
  totalExpenses: number;
}

const MonthlyReport = ({ reportType, expenses, totalIncome, totalExpenses }: MonthlyReportProps) => {
  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg text-foreground capitalize">{reportType} Financial Report</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <p className="text-sm text-muted-foreground">Total Income</p>
            </div>
            <p className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</p>
          </div>

          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <p className="text-sm text-muted-foreground">Total Expenses</p>
            </div>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Net Savings</p>
            </div>
            <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(totalIncome - totalExpenses)}
            </p>
          </div>
        </div>

        {/* Expense Breakdown Chart */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">Expense Breakdown by Category</h4>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>No expenses to display</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MonthlyReport;

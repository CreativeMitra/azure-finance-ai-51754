import { Card } from '@/components/ui/card';
import { IncomeSource } from '@/contexts/FinanceContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface IncomeGrowthChartProps {
  incomeSources: IncomeSource[];
}

const IncomeGrowthChart = ({ incomeSources }: IncomeGrowthChartProps) => {
  // Group income by month
  const monthlyData = incomeSources.reduce((acc, income) => {
    const month = new Date(income.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    // Convert to monthly equivalent
    let monthlyAmount = income.amount;
    if (income.frequency === 'quarterly') monthlyAmount = income.amount / 3;
    if (income.frequency === 'yearly') monthlyAmount = income.amount / 12;
    
    acc[month] += monthlyAmount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    income: Math.round(amount)
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-success/10">
          <TrendingUp className="w-5 h-5 text-success" />
        </div>
        <h3 className="font-semibold text-lg text-foreground">Income Growth Trend</h3>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <p>Add income sources to see growth trends</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
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
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--success))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default IncomeGrowthChart;

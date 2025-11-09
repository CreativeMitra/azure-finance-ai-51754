import { Card } from '@/components/ui/card';
import { Sparkles, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface DebtInsightsProps {
  totalDebt: number;
  totalEMI: number;
  debtToIncomeRatio: number;
}

const DebtInsights = ({ totalDebt, totalEMI, debtToIncomeRatio }: DebtInsightsProps) => {
  const insights = [
    {
      title: 'Debt-to-Income Ratio Analysis',
      description: debtToIncomeRatio > 40 
        ? 'Your debt-to-income ratio is high. Consider debt consolidation or increasing income streams.'
        : debtToIncomeRatio > 20
        ? 'Your debt-to-income ratio is moderate. Focus on paying high-interest loans first.'
        : 'Excellent! Your debt-to-income ratio is healthy. Keep up the good work.',
      type: debtToIncomeRatio > 40 ? 'alert' : debtToIncomeRatio > 20 ? 'warning' : 'success',
      icon: debtToIncomeRatio > 40 ? AlertCircle : debtToIncomeRatio > 20 ? TrendingDown : CheckCircle
    },
    {
      title: 'Debt Reduction Strategy',
      description: 'Consider the snowball method: Pay off smallest debts first for psychological wins, then tackle larger ones.',
      type: 'info',
      icon: Sparkles
    },
    {
      title: 'Extra Payment Impact',
      description: `Adding just ₹5,000 extra per month could save you significant interest and reduce loan tenure by months.`,
      type: 'success',
      icon: TrendingDown
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-lg text-foreground">AI Debt Insights & Suggestions</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const colorClass = 
            insight.type === 'alert' ? 'bg-destructive/10 text-destructive' :
            insight.type === 'warning' ? 'bg-accent/10 text-accent' :
            insight.type === 'success' ? 'bg-success/10 text-success' :
            'bg-primary/10 text-primary';

          return (
            <div key={index} className="flex gap-4 p-4 rounded-lg bg-background/50 border border-border/30">
              <div className={`p-2 rounded-lg h-fit ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          );
        })}

        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Pro Tip:</strong> Prioritize high-interest loans first (avalanche method) 
            to minimize total interest paid over time.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DebtInsights;

import { Card } from '@/components/ui/card';
import { Sparkles, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { AssetLiability, Expense } from '@/contexts/FinanceContext';

interface TaxInsightsProps {
  totalIncome: number;
  expenses: Expense[];
  assetsLiabilities: AssetLiability[];
}

const TaxInsights = ({ totalIncome, expenses, assetsLiabilities }: TaxInsightsProps) => {
  // Calculate tax-deductible expenses (simplified example)
  const taxDeductibleExpenses = expenses
    .filter(e => ['Health', 'Education', 'Charity'].includes(e.category))
    .reduce((sum, e) => sum + e.amount, 0);

  const insights = [
    {
      title: 'Tax-Saving Investments',
      description: 'Consider investing in ELSS mutual funds, PPF, or NPS to save up to ₹1.5L under Section 80C.',
      icon: TrendingUp,
      color: 'success'
    },
    {
      title: 'Health Insurance Deduction',
      description: 'Claim deductions up to ₹25,000 (₹50,000 for senior citizens) under Section 80D for health insurance premiums.',
      icon: FileText,
      color: 'primary'
    },
    {
      title: 'Home Loan Benefits',
      description: 'If you have a home loan, claim deductions up to ₹2L on interest under Section 24(b).',
      icon: AlertCircle,
      color: 'accent'
    }
  ];

  const colorClasses = {
    success: 'bg-success/10 text-success',
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent'
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-lg text-foreground">Tax & Investment Insights</h3>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-background/50 border border-border/30">
          <p className="text-sm text-muted-foreground mb-1">Estimated Annual Income</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(totalIncome * 12)}</p>
        </div>
        <div className="p-4 rounded-lg bg-background/50 border border-border/30">
          <p className="text-sm text-muted-foreground mb-1">Tax-Deductible Expenses</p>
          <p className="text-xl font-bold text-success">{formatCurrency(taxDeductibleExpenses)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="flex gap-4 p-4 rounded-lg bg-background/50 border border-border/30">
              <div className={`p-2 rounded-lg h-fit ${colorClasses[insight.color as keyof typeof colorClasses]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          );
        })}

        <div className="mt-6 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <p className="text-sm text-destructive flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Important:</strong> These are general suggestions. Consult a certified tax advisor for personalized advice 
              based on your specific financial situation.
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TaxInsights;

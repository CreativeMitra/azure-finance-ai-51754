import { Card } from '@/components/ui/card';
import { Sparkles, PiggyBank, Target, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface SavingsSuggestionsProps {
  savingsRate: number;
  totalSavings: number;
}

const SavingsSuggestions = ({ savingsRate, totalSavings }: SavingsSuggestionsProps) => {
  const suggestions = [
    {
      title: '50/30/20 Rule',
      description: 'Allocate 50% to needs, 30% to wants, and 20% to savings. This balanced approach helps maintain financial health.',
      icon: Target,
      color: 'primary'
    },
    {
      title: 'Automated Savings',
      description: 'Set up automatic transfers to your savings account right after salary credit. Save before you spend!',
      icon: PiggyBank,
      color: 'success'
    },
    {
      title: 'High-Yield Savings',
      description: 'Consider fixed deposits or high-yield savings accounts offering 6-8% returns for your emergency fund.',
      icon: TrendingUp,
      color: 'accent'
    }
  ];

  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    accent: 'bg-accent/10 text-accent'
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg text-foreground">Personalized Saving Strategies</h3>
      </div>

      {savingsRate < 10 && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">
            <strong>Alert:</strong> Your savings rate is below 10%. Consider reducing non-essential expenses to improve financial security.
          </p>
        </div>
      )}

      {savingsRate >= 20 && (
        <div className="mb-6 p-4 rounded-lg bg-success/10 border border-success/20">
          <p className="text-sm text-success">
            <strong>Excellent!</strong> You're saving {savingsRate.toFixed(1)}% of your income. Keep up the great work!
          </p>
        </div>
      )}

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <div key={index} className="flex gap-4 p-4 rounded-lg bg-background/50 border border-border/30">
              <div className={`p-2 rounded-lg h-fit ${colorClasses[suggestion.color as keyof typeof colorClasses]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{suggestion.title}</h4>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
            </div>
          );
        })}

        <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Current Monthly Savings:</strong> {formatCurrency(totalSavings)}
            {savingsRate < 20 && ` • Try to increase to 20% for optimal financial health`}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SavingsSuggestions;

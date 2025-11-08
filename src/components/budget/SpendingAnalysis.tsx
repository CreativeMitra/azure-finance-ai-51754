import { useFinance } from '@/contexts/FinanceContext';
import { Sparkles, TrendingDown, AlertTriangle } from 'lucide-react';

const SpendingAnalysis = () => {
  const { budgetCategories, expenses } = useFinance();

  // Generate AI insights based on spending patterns
  const generateInsights = () => {
    const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
    const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
    
    if (totalBudget === 0) return null;

    const spentPercentage = (totalSpent / totalBudget) * 100;
    
    // Find categories near or over limit
    const nearLimit = budgetCategories.filter(cat => {
      const percentage = cat.budgetAmount > 0 ? (cat.spent / cat.budgetAmount) * 100 : 0;
      return percentage >= 90 && percentage <= 100;
    });

    const overLimit = budgetCategories.filter(cat => {
      const percentage = cat.budgetAmount > 0 ? (cat.spent / cat.budgetAmount) * 100 : 0;
      return percentage > 100;
    });

    // Find highest spending category
    const highestSpending = [...budgetCategories].sort((a, b) => b.spent - a.spent)[0];

    return {
      spentPercentage,
      nearLimit,
      overLimit,
      highestSpending,
    };
  };

  // Generate smart suggestions
  const generateSuggestions = () => {
    const insights = generateInsights();
    if (!insights) return [];

    const suggestions = [];

    // Suggestions for over-budget categories
    if (insights.overLimit.length > 0) {
      insights.overLimit.forEach(cat => {
        suggestions.push({
          type: 'warning',
          message: `Your ${cat.name} spending is over budget by ₹${(cat.spent - cat.budgetAmount).toFixed(2)}. Consider reducing non-essential expenses in this category.`,
        });
      });
    }

    // Suggestions for near-limit categories
    if (insights.nearLimit.length > 0) {
      suggestions.push({
        type: 'alert',
        message: `You're approaching the limit for ${insights.nearLimit.map(c => c.name).join(', ')}. Monitor your spending carefully.`,
      });
    }

    // Suggestion for highest spending category
    if (insights.highestSpending && insights.highestSpending.spent > 0) {
      const percentage = (insights.highestSpending.spent / insights.highestSpending.budgetAmount) * 100;
      if (percentage > 70) {
        suggestions.push({
          type: 'info',
          message: `${insights.highestSpending.name} is your highest spending category. Look for ways to optimize these expenses, such as comparing prices or finding alternatives.`,
        });
      }
    }

    // General savings suggestion
    if (insights.spentPercentage < 80) {
      suggestions.push({
        type: 'success',
        message: `Great job! You're managing your budget well. Consider moving the remaining funds to savings or investments.`,
      });
    }

    return suggestions;
  };

  const insights = generateInsights();
  const suggestions = generateSuggestions();

  if (!insights) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* AI Insights */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">Spending Habits Analysis</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Based on your current spending patterns, you've used {insights.spentPercentage.toFixed(1)}% of your total budget. 
              {insights.spentPercentage > 90 ? ' You\'re close to your budget limit - consider tracking expenses more carefully.' :
               insights.spentPercentage > 70 ? ' You\'re on track but watch your spending in the coming days.' :
               ' You\'re managing your budget effectively!'}
            </p>

            {insights.overLimit.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive mb-1">Over Budget Alert</p>
                    <p className="text-sm text-destructive/80">
                      {insights.overLimit.length} {insights.overLimit.length === 1 ? 'category is' : 'categories are'} over budget: {insights.overLimit.map(c => c.name).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-6 h-6 text-success flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-4">Smart Suggestions to Reduce Spending</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      suggestion.type === 'warning' ? 'bg-warning/10 border border-warning/20' :
                      suggestion.type === 'alert' ? 'bg-destructive/10 border border-destructive/20' :
                      suggestion.type === 'success' ? 'bg-success/10 border border-success/20' :
                      'bg-primary/10 border border-primary/20'
                    }`}
                  >
                    <p className={`text-sm ${
                      suggestion.type === 'warning' ? 'text-warning-foreground' :
                      suggestion.type === 'alert' ? 'text-destructive' :
                      suggestion.type === 'success' ? 'text-success' :
                      'text-primary'
                    }`}>
                      {suggestion.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingAnalysis;

import { useNavigate } from 'react-router-dom';
import { TrendingUp, Wallet, CreditCard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency } from '@/lib/formatters';

const Index = () => {
  const navigate = useNavigate();
  const { assetsLiabilities, budgetCategories, expenses } = useFinance();

  const assets = assetsLiabilities.filter(item => item.type === 'asset');
  const liabilities = assetsLiabilities.filter(item => item.type === 'liability');
  const totalAssets = assets.reduce((sum, item) => sum + item.value, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">AI Finance Manager</h1>
          </div>
          <p className="text-xl text-muted-foreground">Your intelligent companion for financial success</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/net-worth')}
            className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Net Worth</h3>
            </div>
            <p className="text-3xl font-bold text-primary">{formatCurrency(netWorth)}</p>
            <p className="text-sm text-muted-foreground mt-2">Track your assets and liabilities</p>
          </div>

          <div 
            onClick={() => navigate('/budgets')}
            className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-success/10 rounded-xl group-hover:bg-success/20 transition-colors">
                <CreditCard className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Budget</h3>
            </div>
            <p className="text-3xl font-bold text-success">{formatCurrency(totalBudget)}</p>
            <p className="text-sm text-muted-foreground mt-2">Manage your spending wisely</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-warning/10 rounded-xl">
                <Wallet className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Spent</h3>
            </div>
            <p className="text-3xl font-bold text-warning">{formatCurrency(totalSpent)}</p>
            <p className="text-sm text-muted-foreground mt-2">{expenses.length} expenses tracked</p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8">
            <Sparkles className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-3">AI-Powered Insights</h3>
            <p className="text-muted-foreground mb-6">
              Get personalized financial recommendations and predictions based on your spending patterns and goals.
            </p>
            <Button onClick={() => navigate('/net-worth')} size="lg" className="w-full">
              View Insights
            </Button>
          </div>

          <div className="bg-gradient-to-br from-success/10 to-primary/10 border border-success/20 rounded-2xl p-8">
            <TrendingUp className="w-8 h-8 text-success mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-3">Smart Budget Planning</h3>
            <p className="text-muted-foreground mb-6">
              Create budgets manually or let AI generate an optimized budget based on your income and expenses.
            </p>
            <Button onClick={() => navigate('/budgets')} size="lg" variant="outline" className="w-full">
              Create Budget
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

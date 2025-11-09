import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

const MarketInsights = () => {
  const insights = [
    {
      title: 'Stock Market Rally',
      description: 'Sensex up 2.3% today driven by IT and banking sector gains',
      trend: 'positive',
      impact: 'high',
      category: 'Equity'
    },
    {
      title: 'Gold Prices Surge',
      description: 'Gold reaches new highs amid global uncertainty, consider diversifying',
      trend: 'positive',
      impact: 'medium',
      category: 'Commodities'
    },
    {
      title: 'Fixed Deposit Rates',
      description: 'Banks offering competitive FD rates between 7-8% for senior citizens',
      trend: 'neutral',
      impact: 'medium',
      category: 'Fixed Income'
    },
    {
      title: 'Crypto Volatility',
      description: 'Bitcoin experiences 10% swing in last 24 hours, exercise caution',
      trend: 'negative',
      impact: 'high',
      category: 'Crypto'
    },
    {
      title: 'Real Estate Growth',
      description: 'Property prices in metro cities show 5% YoY growth',
      trend: 'positive',
      impact: 'medium',
      category: 'Real Estate'
    },
    {
      title: 'Mutual Fund Performance',
      description: 'Large cap funds outperform mid cap by 3% this quarter',
      trend: 'positive',
      impact: 'medium',
      category: 'Mutual Funds'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
          Market Insights
        </h1>
        <p className="text-muted-foreground mt-2">Real-time AI insights on market trends</p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sensex</p>
              <p className="text-2xl font-bold text-foreground">72,450</p>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +2.3%
              </p>
            </div>
            <Activity className="w-8 h-8 text-success" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nifty 50</p>
              <p className="text-2xl font-bold text-foreground">21,890</p>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +1.8%
              </p>
            </div>
            <Activity className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gold (10g)</p>
              <p className="text-2xl font-bold text-foreground">₹63,200</p>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +0.5%
              </p>
            </div>
            <Activity className="w-8 h-8 text-accent" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">USD/INR</p>
              <p className="text-2xl font-bold text-foreground">₹83.25</p>
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3" /> -0.3%
              </p>
            </div>
            <Activity className="w-8 h-8 text-destructive" />
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                insight.trend === 'positive' ? 'bg-success/10 text-success' :
                insight.trend === 'negative' ? 'bg-destructive/10 text-destructive' :
                'bg-accent/10 text-accent'
              }`}>
                {insight.trend === 'positive' ? <TrendingUp className="w-5 h-5" /> :
                 insight.trend === 'negative' ? <TrendingDown className="w-5 h-5" /> :
                 <Activity className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{insight.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    insight.impact === 'high' ? 'bg-destructive/10 text-destructive' :
                    'bg-accent/10 text-accent'
                  }`}>
                    {insight.impact} impact
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {insight.category}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Disclaimer */}
      <Card className="p-4 bg-muted/50 border-border/50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> These insights are AI-generated based on market data and should not be considered as financial advice. 
            Please consult with a certified financial advisor before making investment decisions.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MarketInsights;

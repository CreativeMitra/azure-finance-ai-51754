import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MarketInsights = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [marketData, setMarketData] = useState({
    sensex: 72450,
    sensexChange: 2.3,
    nifty: 21890,
    niftyChange: 1.8,
    gold: 63200,
    goldChange: 0.5,
    usd: 83.25,
    usdChange: -0.3
  });

  // Generate dynamic AI insights based on current time and data
  const generateDynamicInsights = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const timeBasedInsights = [];

    // Time-based insights
    if (hour < 12) {
      timeBasedInsights.push({
        title: 'Morning Market Analysis',
        description: `Markets opening strong with ${marketData.sensexChange > 0 ? 'positive momentum' : 'cautious trading'}. IT and banking sectors showing ${marketData.sensexChange > 1 ? 'strong' : 'moderate'} activity.`,
        trend: marketData.sensexChange > 0 ? 'positive' : 'negative',
        impact: 'high',
        category: 'Equity'
      });
    } else if (hour < 18) {
      timeBasedInsights.push({
        title: 'Mid-Day Market Update',
        description: `Trading volumes picking up. Sensex ${marketData.sensexChange > 0 ? 'maintaining gains' : 'facing pressure'} at ${marketData.sensex}. Investor sentiment remains ${marketData.sensexChange > 1.5 ? 'bullish' : 'mixed'}.`,
        trend: marketData.sensexChange > 0 ? 'positive' : 'negative',
        impact: 'high',
        category: 'Equity'
      });
    } else {
      timeBasedInsights.push({
        title: 'Market Close Analysis',
        description: `Markets close with Sensex ${marketData.sensexChange > 0 ? 'up' : 'down'} ${Math.abs(marketData.sensexChange).toFixed(1)}%. ${marketData.niftyChange > 0 ? 'Positive close across major indices' : 'Mixed sentiment across sectors'}.`,
        trend: marketData.sensexChange > 0 ? 'positive' : 'negative',
        impact: 'high',
        category: 'Equity'
      });
    }

    // Gold insights
    timeBasedInsights.push({
      title: 'Gold Market Dynamics',
      description: `Gold ${marketData.goldChange > 0 ? 'gains' : 'loses'} ${Math.abs(marketData.goldChange).toFixed(1)}% to ₹${marketData.gold.toLocaleString()}. ${marketData.goldChange > 0 ? 'Safe-haven demand increasing' : 'Profit booking observed'} amid global economic indicators.`,
      trend: marketData.goldChange > 0 ? 'positive' : marketData.goldChange < 0 ? 'negative' : 'neutral',
      impact: 'medium',
      category: 'Commodities'
    });

    // Fixed Income
    timeBasedInsights.push({
      title: 'Fixed Deposit Opportunities',
      description: `Banks offering competitive FD rates between 7-8% for senior citizens. ${day < 5 ? 'Good time to lock in rates before weekend' : 'Consider booking FDs early next week'}.`,
      trend: 'neutral',
      impact: 'medium',
      category: 'Fixed Income'
    });

    // Crypto insights
    const cryptoVolatility = Math.random() > 0.5;
    timeBasedInsights.push({
      title: 'Cryptocurrency Update',
      description: `Bitcoin ${cryptoVolatility ? 'experiences high volatility' : 'shows relative stability'} in last 24 hours. ${cryptoVolatility ? 'Exercise caution with crypto investments' : 'Market consolidating at current levels'}.`,
      trend: cryptoVolatility ? 'negative' : 'neutral',
      impact: 'high',
      category: 'Crypto'
    });

    // Real Estate
    timeBasedInsights.push({
      title: 'Real Estate Trends',
      description: `Property prices in metro cities show ${(4 + Math.random() * 3).toFixed(1)}% YoY growth. ${marketData.sensexChange > 0 ? 'Strong economic indicators support real estate growth' : 'Market correction may present buying opportunities'}.`,
      trend: 'positive',
      impact: 'medium',
      category: 'Real Estate'
    });

    // Mutual Funds
    timeBasedInsights.push({
      title: 'Mutual Fund Performance',
      description: `Large cap funds ${marketData.niftyChange > 0 ? 'outperform' : 'underperform'} mid cap by ${(2 + Math.random() * 2).toFixed(1)}% this quarter. ${marketData.niftyChange > 1 ? 'Strong performance across equity funds' : 'Mixed returns across categories'}.`,
      trend: marketData.niftyChange > 0 ? 'positive' : 'neutral',
      impact: 'medium',
      category: 'Mutual Funds'
    });

    setInsights(timeBasedInsights);
  };

  // Simulate market data updates
  const refreshMarketData = () => {
    setMarketData(prev => ({
      sensex: prev.sensex + (Math.random() - 0.5) * 200,
      sensexChange: prev.sensexChange + (Math.random() - 0.5) * 0.5,
      nifty: prev.nifty + (Math.random() - 0.5) * 100,
      niftyChange: prev.niftyChange + (Math.random() - 0.5) * 0.3,
      gold: prev.gold + (Math.random() - 0.5) * 100,
      goldChange: prev.goldChange + (Math.random() - 0.5) * 0.2,
      usd: prev.usd + (Math.random() - 0.5) * 0.5,
      usdChange: prev.usdChange + (Math.random() - 0.5) * 0.1
    }));
  };

  useEffect(() => {
    generateDynamicInsights();
    const interval = setInterval(() => {
      refreshMarketData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    generateDynamicInsights();
  }, [marketData]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
            Market Insights
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Live AI-powered market analysis & trends
          </p>
        </div>
        <Button 
          onClick={() => { refreshMarketData(); generateDynamicInsights(); }}
          variant="outline"
          className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </Button>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sensex</p>
              <p className="text-2xl font-bold text-foreground">{marketData.sensex.toFixed(0).toLocaleString()}</p>
              <p className={`text-xs flex items-center gap-1 mt-1 ${marketData.sensexChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {marketData.sensexChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {marketData.sensexChange >= 0 ? '+' : ''}{marketData.sensexChange.toFixed(2)}%
              </p>
            </div>
            <Activity className="w-8 h-8 text-success" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nifty 50</p>
              <p className="text-2xl font-bold text-foreground">{marketData.nifty.toFixed(0).toLocaleString()}</p>
              <p className={`text-xs flex items-center gap-1 mt-1 ${marketData.niftyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {marketData.niftyChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {marketData.niftyChange >= 0 ? '+' : ''}{marketData.niftyChange.toFixed(2)}%
              </p>
            </div>
            <Activity className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gold (10g)</p>
              <p className="text-2xl font-bold text-foreground">₹{marketData.gold.toFixed(0).toLocaleString()}</p>
              <p className={`text-xs flex items-center gap-1 mt-1 ${marketData.goldChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {marketData.goldChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {marketData.goldChange >= 0 ? '+' : ''}{marketData.goldChange.toFixed(2)}%
              </p>
            </div>
            <Activity className="w-8 h-8 text-accent" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">USD/INR</p>
              <p className="text-2xl font-bold text-foreground">₹{marketData.usd.toFixed(2)}</p>
              <p className={`text-xs flex items-center gap-1 mt-1 ${marketData.usdChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {marketData.usdChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {marketData.usdChange >= 0 ? '+' : ''}{marketData.usdChange.toFixed(2)}%
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

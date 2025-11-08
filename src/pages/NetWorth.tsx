import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency } from '@/lib/formatters';
import { Pencil, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import NetWorthGrowthPredictor from '@/components/net-worth/NetWorthGrowthPredictor';
import AssetLiabilityRatio from '@/components/net-worth/AssetLiabilityRatio';
import AssetAllocation from '@/components/net-worth/AssetAllocation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NetWorth = () => {
  const { assetsLiabilities } = useFinance();
  const navigate = useNavigate();

  const assets = assetsLiabilities.filter(item => item.type === 'asset');
  const liabilities = assetsLiabilities.filter(item => item.type === 'liability');

  const totalAssets = assets.reduce((sum, item) => sum + item.value, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  // Generate AI insight
  const generateAIInsight = () => {
    const debtRatio = totalLiabilities / (totalAssets || 1);
    const debtPercentage = (debtRatio * 100).toFixed(0);
    
    if (debtRatio > 0.5) {
      const extraPayment = Math.round(totalLiabilities * 0.1);
      const goalAmount = Math.ceil(netWorth * 1.2 / 1000) * 1000;
      return `Your debt-to-income ratio is slightly high at ${debtPercentage}%. Consider allocating an extra $${extraPayment.toLocaleString()}/month towards your credit card debt to improve your financial health and reach your $${goalAmount.toLocaleString()}k net worth goal 2 months faster.`;
    } else if (debtRatio > 0.3) {
      return `Your debt-to-income ratio is moderate at ${debtPercentage}%. Maintaining your current payment schedule will help you achieve your financial goals steadily.`;
    } else {
      return `Excellent debt management! Your debt-to-income ratio is healthy at ${debtPercentage}%. Consider investing more in diversified assets to accelerate wealth growth.`;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 xl:p-10">
      <div className="max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-extrabold mb-4 tracking-tight">Net Worth Tracker</h1>

        {/* Net Worth Card & Assets/Liabilities */}
        <div className="space-y-6 lg:space-y-8">
          {/* Total Net Worth - full width, reduced height */}
          <div className="bg-card border border-border rounded-2xl lg:rounded-3xl p-6 lg:p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl lg:text-2xl font-semibold">Total Net Worth</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-foreground">Net Worth = Total Assets - Total Liabilities</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold text-foreground tracking-tight break-words">{formatCurrency(netWorth)}</p>
          </div>

          {/* Assets/Liabilities Cards - full width, less height than net worth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {/* Assets */}
            <div className="bg-card border border-border rounded-2xl lg:rounded-3xl p-6 lg:p-7 animate-fade-in hover-scale">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base lg:text-xl font-semibold">Total Assets</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-success/10"
                  onClick={() => navigate('/assets-liabilities?type=asset')}
                >
                  <Pencil className="w-5 h-5 text-foreground" />
                </Button>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground break-words">{formatCurrency(totalAssets)}</p>
            </div>

            {/* Liabilities */}
            <div className="bg-card border border-border rounded-2xl lg:rounded-3xl p-6 lg:p-7 animate-fade-in hover-scale">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base lg:text-xl font-semibold">Total Liabilities</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-destructive/10"
                  onClick={() => navigate('/assets-liabilities?type=liability')}
                >
                  <Pencil className="w-5 h-5 text-foreground" />
                </Button>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground break-words">{formatCurrency(totalLiabilities)}</p>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-card border border-border rounded-2xl lg:rounded-3xl p-6 lg:p-8 xl:p-10 animate-fade-in">
          <div className="flex items-start gap-4 lg:gap-6">
            <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl lg:text-2xl font-display font-semibold mb-3">AI Insights</h3>
              <p className="text-base lg:text-lg text-foreground leading-relaxed">
                {generateAIInsight()}
              </p>
            </div>
          </div>
        </div>

        {/* Growth Predictor & Ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <NetWorthGrowthPredictor 
              currentNetWorth={netWorth}
              trendData={assetsLiabilities}
            />
          </div>
          <AssetLiabilityRatio 
            totalAssets={totalAssets}
            totalLiabilities={totalLiabilities}
          />
        </div>

        {/* Asset Allocation */}
        <AssetAllocation assets={assets} />
      </div>
    </div>
  );
};

export default NetWorth;

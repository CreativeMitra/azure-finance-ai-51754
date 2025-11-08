import { useMemo } from 'react';
import { TrendingUp, Rocket } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { AssetLiability } from '@/contexts/FinanceContext';

interface NetWorthGrowthPredictorProps {
  currentNetWorth: number;
  trendData: AssetLiability[];
}

const NetWorthGrowthPredictor = ({ currentNetWorth, trendData }: NetWorthGrowthPredictorProps) => {
  const predictions = useMemo(() => {
    if (trendData.length < 2) {
      return null;
    }

    // Calculate monthly growth rate
    const sortedData = [...trendData].sort((a, b) => a.date.getTime() - b.date.getTime());
    const oldest = sortedData[0];
    const newest = sortedData[sortedData.length - 1];
    
    const monthsDiff = Math.max(1, (newest.date.getTime() - oldest.date.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const totalGrowth = currentNetWorth - (oldest.type === 'asset' ? oldest.value : -oldest.value);
    const monthlyGrowthRate = totalGrowth / monthsDiff / currentNetWorth;

    // Generate predictions for different scenarios
    const scenarios = {
      conservative: monthlyGrowthRate * 0.7,
      moderate: monthlyGrowthRate,
      optimistic: monthlyGrowthRate * 1.3,
    };

    const calculate = (months: number, rate: number) => {
      return currentNetWorth * (1 + rate * months);
    };

    return {
      monthlyGrowth: monthlyGrowthRate * currentNetWorth,
      threeMonth: calculate(3, scenarios.moderate),
      sixMonth: calculate(6, scenarios.moderate),
      oneYear: calculate(12, scenarios.moderate),
      nextMilestone: Math.ceil(currentNetWorth / 50000) * 50000,
    };
  }, [currentNetWorth, trendData]);

  if (!predictions) {
    return (
      <div className="bg-card border border-border rounded-2xl lg:rounded-3xl p-6 lg:p-8 xl:p-10 animate-fade-in min-h-[300px]">
        <div className="flex items-center gap-4 mb-6">
          <TrendingUp className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
          <h3 className="text-xl lg:text-2xl font-display font-semibold">AI Growth Predictor</h3>
        </div>
        <p className="text-base lg:text-lg text-foreground">Add assets and liabilities with dates to see predictions</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl lg:rounded-3xl p-6 lg:p-8 xl:p-10 animate-fade-in min-h-[300px]">
      <div className="flex items-center gap-4 mb-4">
        <TrendingUp className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
        <h3 className="text-xl lg:text-2xl font-display font-semibold">AI Growth Predictor</h3>
      </div>
      <p className="text-sm lg:text-base text-foreground mb-8">
        Your net worth is projected to continue its upward trend based on your current financial habits.
      </p>

      {/* Projection Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-secondary/30 rounded-xl lg:rounded-2xl p-6 lg:p-8 xl:p-10 hover-scale transition-all min-h-[140px] lg:min-h-[160px]">
          <p className="text-sm lg:text-base text-foreground/70 mb-3 lg:mb-4">3-Month Projection</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-extrabold text-foreground break-words leading-tight">{formatCurrency(predictions.threeMonth)}</p>
        </div>
        <div className="bg-secondary/40 rounded-xl lg:rounded-2xl p-6 lg:p-8 xl:p-10 hover-scale transition-all min-h-[140px] lg:min-h-[160px]">
          <p className="text-sm lg:text-base text-foreground/70 mb-3 lg:mb-4">6-Month Projection</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-extrabold text-foreground break-words leading-tight">{formatCurrency(predictions.sixMonth)}</p>
        </div>
        <div className="bg-secondary/50 rounded-xl lg:rounded-2xl p-6 lg:p-8 xl:p-10 hover-scale transition-all min-h-[140px] lg:min-h-[160px] sm:col-span-2 lg:col-span-1">
          <p className="text-sm lg:text-base text-foreground/70 mb-3 lg:mb-4">1-Year Projection</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-extrabold text-foreground break-words leading-tight">{formatCurrency(predictions.oneYear)}</p>
        </div>
      </div>
    </div>
  );
};

export default NetWorthGrowthPredictor;

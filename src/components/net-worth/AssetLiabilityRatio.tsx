import { TrendingUp, TrendingDown } from 'lucide-react';

interface AssetLiabilityRatioProps {
  totalAssets: number;
  totalLiabilities: number;
}

const AssetLiabilityRatio = ({ totalAssets, totalLiabilities }: AssetLiabilityRatioProps) => {
  const ratio = totalLiabilities > 0 ? totalAssets / totalLiabilities : totalAssets;
  const assetPercentage = totalAssets > 0 ? (totalAssets / (totalAssets + totalLiabilities)) * 100 : 50;
  const liabilityPercentage = 100 - assetPercentage;
  const trend = ratio > 3 ? 'positive' : ratio > 2 ? 'moderate' : 'needs-attention';

  return (
    <div className="bg-card border border-border rounded-2xl lg:rounded-3xl p-6 lg:p-8 xl:p-10 animate-fade-in min-h-[300px]">
      <h3 className="text-xl lg:text-2xl font-display font-semibold mb-8 lg:mb-10">Asset vs. Liability Ratio</h3>
      
      {/* Ratio Display */}
      <div className="text-center mb-8 lg:mb-10">
        <p className="text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold text-foreground mb-3 tracking-tight">
          {ratio.toFixed(1)}<span className="text-2xl lg:text-3xl xl:text-4xl font-bold"> : 1</span>
        </p>
        <div className="flex items-center justify-center gap-3 text-sm lg:text-base">
          <span className="text-foreground">
            Trending
          </span>
          {trend === 'positive' ? (
            <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-success" />
          ) : (
            <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-destructive" />
          )}
          <span className="text-foreground font-medium">+0.2%</span>
        </div>
      </div>

      {/* Visual Bar */}
      <div className="mb-6">
        <div className="h-4 lg:h-5 bg-secondary rounded-full overflow-hidden flex">
          <div 
            className="bg-success transition-all duration-700 ease-out"
            style={{ width: `${assetPercentage}%` }}
          />
          <div 
            className="bg-destructive transition-all duration-700 ease-out"
            style={{ width: `${liabilityPercentage}%` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between text-sm lg:text-base">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-success" />
          <span className="text-foreground font-medium">Assets</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-foreground font-medium">Liabilities</span>
          <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-destructive" />
        </div>
      </div>
    </div>
  );
};

export default AssetLiabilityRatio;

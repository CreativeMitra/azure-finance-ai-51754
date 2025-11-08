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
    <div className="relative overflow-hidden bg-gradient-to-br from-card via-card to-accent/10 border border-border/50 rounded-2xl lg:rounded-3xl p-6 lg:p-7 xl:p-8 animate-fade-in hover-scale backdrop-blur-sm">
      {/* Decorative gradient overlays */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-success/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-destructive/10 rounded-full blur-3xl -z-10" />
      
      <h3 className="text-xl lg:text-2xl font-display font-semibold mb-6 text-heading">Asset vs. Liability Ratio</h3>
      
      {/* Ratio Display */}
      <div className="text-center mb-6 lg:mb-8 p-6 rounded-2xl bg-background/40 border border-border/30">
        <p className="text-4xl lg:text-5xl xl:text-6xl font-display font-extrabold bg-gradient-to-r from-success via-primary to-accent bg-clip-text text-transparent mb-3 tracking-tight">
          {ratio.toFixed(1)}<span className="text-xl lg:text-2xl xl:text-3xl font-bold"> : 1</span>
        </p>
        <div className="flex items-center justify-center gap-3 text-sm lg:text-base">
          <span className="text-muted-foreground">
            Trending
          </span>
          {trend === 'positive' ? (
            <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-success animate-pulse" />
          ) : (
            <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-destructive animate-pulse" />
          )}
          <span className={`font-semibold ${trend === 'positive' ? 'text-success' : 'text-destructive'}`}>+0.2%</span>
        </div>
      </div>

      {/* Visual Bar with glow effect */}
      <div className="mb-5">
        <div className="h-5 lg:h-6 bg-secondary/50 rounded-full overflow-hidden flex shadow-inner relative">
          <div 
            className="bg-gradient-to-r from-success to-success/80 transition-all duration-700 ease-out relative"
            style={{ width: `${assetPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
          </div>
          <div 
            className="bg-gradient-to-r from-destructive/80 to-destructive transition-all duration-700 ease-out relative"
            style={{ width: `${liabilityPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
          </div>
        </div>
      </div>

      {/* Legend with enhanced styling */}
      <div className="flex justify-between text-sm lg:text-base">
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
          <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-success shadow-lg shadow-success/50" />
          <span className="text-foreground font-semibold">Assets</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-destructive/10 border border-destructive/20">
          <span className="text-foreground font-semibold">Liabilities</span>
          <div className="w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-destructive shadow-lg shadow-destructive/50" />
        </div>
      </div>
    </div>
  );
};

export default AssetLiabilityRatio;

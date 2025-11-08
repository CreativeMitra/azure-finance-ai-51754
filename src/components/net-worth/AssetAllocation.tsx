import { AssetLiability } from '@/contexts/FinanceContext';

interface AssetAllocationProps {
  assets: AssetLiability[];
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
  'hsl(var(--chart-8))',
  'hsl(var(--chart-9))',
  'hsl(var(--chart-10))',
  'hsl(var(--chart-11))',
  'hsl(var(--chart-12))',
  'hsl(var(--chart-13))',
  'hsl(var(--chart-14))',
  'hsl(var(--chart-15))',
];

const AssetAllocation = ({ assets }: AssetAllocationProps) => {
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);

  // Group by category
  const categoryMap = assets.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = 0;
    }
    acc[asset.category] += asset.value;
    return acc;
  }, {} as Record<string, number>);

  const allocations = Object.entries(categoryMap)
    .map(([category, value]) => ({
      category,
      value,
      percentage: (value / totalAssets) * 100,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-card via-card to-secondary/20 border border-border/50 rounded-2xl lg:rounded-3xl p-6 lg:p-7 xl:p-8 animate-fade-in hover-scale backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl -z-10" />
      
      <h3 className="text-xl lg:text-2xl font-display font-semibold mb-6 text-heading">Asset Allocation</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-5">
        {allocations.map((item, index) => (
          <div key={item.category} className="group flex items-center gap-3 min-w-0 p-3 rounded-xl bg-background/40 hover:bg-background/60 transition-all duration-300 border border-border/30 hover:border-primary/50">
            <div 
              className="w-3 h-3 lg:w-4 lg:h-4 rounded-full flex-shrink-0 ring-2 ring-background/50 group-hover:ring-primary/30 transition-all duration-300 shadow-lg"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs lg:text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{item.category}</p>
              <p className="text-xs lg:text-sm font-bold text-primary/90">{item.percentage.toFixed(item.percentage < 1 ? 1 : 0)}%</p>
            </div>
          </div>
        ))}
      </div>

      {allocations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-base lg:text-lg text-muted-foreground">No assets added yet</p>
          <p className="text-sm text-muted-foreground/60 mt-2">Start by adding your assets to see allocation</p>
        </div>
      )}
    </div>
  );
};

export default AssetAllocation;

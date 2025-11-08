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
    <div className="bg-card border border-border rounded-2xl lg:rounded-3xl p-6 lg:p-8 xl:p-10 animate-fade-in min-h-[200px]">
      <h3 className="text-xl lg:text-2xl font-display font-semibold mb-8">Asset Allocation</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-6">
        {allocations.map((item, index) => (
          <div key={item.category} className="flex items-center gap-3 min-w-0">
            <div 
              className="w-4 h-4 lg:w-5 lg:h-5 rounded-full flex-shrink-0"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm lg:text-base font-medium text-foreground truncate">{item.category}</p>
              <p className="text-sm text-foreground/70">{item.percentage.toFixed(item.percentage < 1 ? 1 : 0)}%</p>
            </div>
          </div>
        ))}
      </div>

      {allocations.length === 0 && (
        <p className="text-center text-base lg:text-lg text-foreground/70 py-8">No assets added yet</p>
      )}
    </div>
  );
};

export default AssetAllocation;

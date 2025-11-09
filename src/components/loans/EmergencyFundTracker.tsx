import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Shield, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

const EmergencyFundTracker = () => {
  const { emergencyFund, setEmergencyFund, budgetSettings } = useFinance();
  const [amount, setAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const monthlyExpenses = budgetSettings?.fixedExpenses || 0;
  const targetFund = monthlyExpenses * 6; // 6 months of expenses
  const progress = targetFund > 0 ? (emergencyFund / targetFund) * 100 : 0;

  const handleTransaction = (type: 'add' | 'remove') => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;

    if (type === 'add') {
      setEmergencyFund(emergencyFund + value);
    } else {
      setEmergencyFund(Math.max(0, emergencyFund - value));
    }
    setAmount('');
    setIsAdding(false);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-success/20">
          <Shield className="w-6 h-6 text-success" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground">Emergency Fund</h3>
          <p className="text-sm text-muted-foreground">Your financial safety net</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Current Fund</span>
            <span className="text-2xl font-bold text-success">{formatCurrency(emergencyFund)}</span>
          </div>
          <Progress value={progress} className="h-3 mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress.toFixed(1)}% of target</span>
            <span>Target: {formatCurrency(targetFund)}</span>
          </div>
        </div>

        {!isAdding ? (
          <div className="flex gap-2">
            <Button onClick={() => setIsAdding(true)} variant="outline" className="flex-1 gap-2">
              <Plus className="w-4 h-4" />
              Add/Remove Funds
            </Button>
          </div>
        ) : (
          <div className="space-y-3 p-4 rounded-lg border border-border bg-background/50">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={() => handleTransaction('add')} className="flex-1 gap-2" size="sm">
                <Plus className="w-4 h-4" />
                Add
              </Button>
              <Button onClick={() => handleTransaction('remove')} variant="destructive" className="flex-1 gap-2" size="sm">
                <Minus className="w-4 h-4" />
                Remove
              </Button>
              <Button onClick={() => { setIsAdding(false); setAmount(''); }} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground text-center">
            Recommended: 6 months of expenses ({formatCurrency(targetFund)})
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EmergencyFundTracker;

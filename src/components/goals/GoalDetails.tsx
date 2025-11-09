import { useState } from 'react';
import { Goal } from '@/contexts/FinanceContext';
import { useFinance } from '@/contexts/FinanceContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/formatters';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, Plus, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface GoalDetailsProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

const GoalDetails = ({ goal, isOpen, onClose }: GoalDetailsProps) => {
  const { addGoalFund } = useFinance();
  const [fundAmount, setFundAmount] = useState('');
  const [fundDate, setFundDate] = useState('');
  const [showAddFund, setShowAddFund] = useState(false);

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const weeksLeft = Math.ceil(daysLeft / 7);
  const monthsLeft = Math.ceil(daysLeft / 30);

  const weeklyRequired = weeksLeft > 0 ? remaining / weeksLeft : 0;
  const monthlyRequired = monthsLeft > 0 ? remaining / monthsLeft : 0;
  const yearlyRequired = remaining;

  const handleAddFund = (e: React.FormEvent) => {
    e.preventDefault();
    addGoalFund(goal.id, {
      amount: parseFloat(fundAmount),
      date: new Date(fundDate)
    });
    setFundAmount('');
    setFundDate('');
    setShowAddFund(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{goal.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-2xl font-bold text-foreground">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Amount</p>
                <p className="text-xl font-bold text-success">{formatCurrency(goal.currentAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Target Amount</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(goal.targetAmount)}</p>
              </div>
            </div>
          </div>

          {/* AI-Calculated Required Savings */}
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">AI-Calculated Savings Required</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-xs text-muted-foreground mb-2">Weekly</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(weeklyRequired)}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-xs text-muted-foreground mb-2">Monthly</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(monthlyRequired)}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-xs text-muted-foreground mb-2">Yearly</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(yearlyRequired)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{daysLeft > 0 ? `${daysLeft} days remaining` : 'Goal deadline passed'}</span>
            </div>
          </Card>

          {/* Add Fund Section */}
          {!showAddFund ? (
            <Button onClick={() => setShowAddFund(true)} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Add Funds to Goal
            </Button>
          ) : (
            <form onSubmit={handleAddFund} className="space-y-4 p-4 rounded-lg border border-border">
              <div>
                <Label htmlFor="fundAmount">Amount (₹)</Label>
                <Input
                  id="fundAmount"
                  type="number"
                  placeholder="5000"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fundDate">Date</Label>
                <Input
                  id="fundDate"
                  type="date"
                  value={fundDate}
                  onChange={(e) => setFundDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Add Fund</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddFund(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {/* Fund History */}
          {goal.funds.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Fund History
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {goal.funds.map((fund) => (
                  <div key={fund.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">
                      {new Date(fund.date).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-success">{formatCurrency(fund.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {goal.note && (
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Note</p>
              <p className="text-foreground">{goal.note}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDetails;

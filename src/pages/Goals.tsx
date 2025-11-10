import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Button } from '@/components/ui/button';
import { Plus, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/formatters';
import GoalCard from '@/components/goals/GoalCard';
import GoalDetails from '@/components/goals/GoalDetails';
import { Goal } from '@/contexts/FinanceContext';

const Goals = () => {
  const { goals, addGoal, deleteGoal } = useFinance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    category: 'short-term' as const,
    priority: 'medium' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal({
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      deadline: new Date(formData.deadline),
      category: formData.category,
      priority: formData.priority,
      note: ''
    });
    setFormData({
      name: '',
      targetAmount: '',
      deadline: '',
      category: 'short-term',
      priority: 'medium'
    });
    setIsAddDialogOpen(false);
  };

  const handleDelete = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goalId);
    }
  };

  const totalGoalsValue = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const progressPercentage = totalGoalsValue > 0 ? (totalSaved / totalGoalsValue) * 100 : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
            Goals & Savings
          </h1>
          <p className="text-muted-foreground mt-2">Track and achieve your financial goals</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-5 h-5" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Create New Goal
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="Buy a Laptop, Save for Vacation..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAmount" className="text-base font-semibold">Target Amount (₹)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="50000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="h-12 text-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-base font-semibold">Target Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="h-12"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-base font-semibold">Time Frame</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short-term">Short Term</SelectItem>
                      <SelectItem value="mid-term">Mid Term</SelectItem>
                      <SelectItem value="long-term">Long Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-base font-semibold">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all">
                Create Goal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all">
          <p className="text-sm font-semibold text-primary/80 mb-3 uppercase tracking-wide">Active Goals</p>
          <p className="text-5xl font-bold text-foreground mb-2">{goals.length}</p>
          <div className="h-1.5 w-20 bg-primary/30 rounded-full" />
        </div>
        <div className="p-8 rounded-3xl bg-gradient-to-br from-success/15 via-success/10 to-success/5 border-2 border-success/20 shadow-lg hover:shadow-xl transition-all">
          <p className="text-sm font-semibold text-success/80 mb-3 uppercase tracking-wide">Total Saved</p>
          <p className="text-5xl font-bold text-foreground mb-2">{formatCurrency(totalSaved)}</p>
          <div className="h-1.5 w-20 bg-success/30 rounded-full" />
        </div>
        <div className="p-8 rounded-3xl bg-gradient-to-br from-accent/15 via-accent/10 to-accent/5 border-2 border-accent/20 shadow-lg hover:shadow-xl transition-all">
          <p className="text-sm font-semibold text-accent/80 mb-3 uppercase tracking-wide">Overall Progress</p>
          <p className="text-5xl font-bold text-foreground mb-2">{progressPercentage.toFixed(1)}%</p>
          <div className="h-1.5 w-20 bg-accent/30 rounded-full" />
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            onClick={() => setSelectedGoal(goal)}
            onDelete={() => handleDelete(goal.id)}
          />
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No goals yet. Create your first goal to get started!</p>
        </div>
      )}

      {/* Goal Details Dialog */}
      {selectedGoal && (
        <GoalDetails 
          goal={selectedGoal} 
          isOpen={!!selectedGoal}
          onClose={() => setSelectedGoal(null)}
        />
      )}
    </div>
  );
};

export default Goals;

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
  const { goals, addGoal } = useFinance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    category: 'short-term' as const,
    priority: 'medium' as const,
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal({
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      deadline: new Date(formData.deadline),
      category: formData.category,
      priority: formData.priority,
      note: formData.note
    });
    setFormData({
      name: '',
      targetAmount: '',
      deadline: '',
      category: 'short-term',
      priority: 'medium',
      note: ''
    });
    setIsAddDialogOpen(false);
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
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="Buy a Laptop"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="50000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short-term">Short Term (0-1 year)</SelectItem>
                    <SelectItem value="mid-term">Mid Term (1-5 years)</SelectItem>
                    <SelectItem value="long-term">Long Term (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="note">Optional Note</Label>
                <Textarea
                  id="note"
                  placeholder="Any additional details..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Create Goal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Total Goals</p>
          <p className="text-3xl font-bold text-foreground">{goals.length}</p>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
          <p className="text-sm text-muted-foreground mb-2">Total Saved</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(totalSaved)}</p>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
          <p className="text-3xl font-bold text-foreground">{progressPercentage.toFixed(1)}%</p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            onClick={() => setSelectedGoal(goal)}
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

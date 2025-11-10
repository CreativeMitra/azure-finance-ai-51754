import { Goal } from '@/contexts/FinanceContext';
import { Card } from '@/components/ui/card';
import { Pencil, Target, Calendar, Trash2, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface GoalCardProps {
  goal: Goal;
  onClick: () => void;
  onDelete: () => void;
}

const GoalCard = ({ goal, onClick, onDelete }: GoalCardProps) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const categoryColors = {
    'short-term': 'from-success/10 to-success/5 border-success/20',
    'mid-term': 'from-primary/10 to-primary/5 border-primary/20',
    'long-term': 'from-accent/10 to-accent/5 border-accent/20'
  };

  const priorityColors = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-accent/20 text-accent',
    high: 'bg-destructive/20 text-destructive'
  };

  return (
    <Card 
      className={`group relative overflow-hidden p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${categoryColors[goal.category]} border-2 hover:scale-[1.02]`}
      onClick={onClick}
    >
      {/* Header with Priority Badge */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="font-bold text-xl text-foreground mb-3 line-clamp-2">{goal.name}</h3>
          <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold ${priorityColors[goal.priority]}`}>
            <TrendingUp className="w-3 h-3" />
            {goal.priority.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-muted-foreground">Progress</span>
          <span className="text-2xl font-bold text-foreground">{progress.toFixed(1)}%</span>
        </div>
        <Progress value={progress} className="h-3 mb-3" />
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-success">{formatCurrency(goal.currentAmount)}</span>
          <span className="font-semibold text-foreground">{formatCurrency(goal.targetAmount)}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t-2 border-border/30">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <p className="text-xs font-semibold">Time Left</p>
          </div>
          <p className={`font-bold text-lg ${daysLeft > 0 ? 'text-foreground' : 'text-destructive'}`}>
            {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4" />
            <p className="text-xs font-semibold">Type</p>
          </div>
          <p className="font-bold text-lg text-foreground capitalize">{goal.category.replace('-', ' ')}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9 rounded-full shadow-lg hover:shadow-xl"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="h-9 w-9 rounded-full shadow-lg hover:shadow-xl"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default GoalCard;

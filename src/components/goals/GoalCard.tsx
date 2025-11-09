import { Goal } from '@/contexts/FinanceContext';
import { Card } from '@/components/ui/card';
import { Pencil, Target, Calendar, Flag } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Progress } from '@/components/ui/progress';

interface GoalCardProps {
  goal: Goal;
  onClick: () => void;
}

const GoalCard = ({ goal, onClick }: GoalCardProps) => {
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
      className={`p-6 cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br ${categoryColors[goal.category]}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground mb-1">{goal.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[goal.priority]}`}>
            {goal.priority} priority
          </span>
        </div>
        <button 
          className="p-2 hover:bg-background/50 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Pencil className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{formatCurrency(goal.currentAmount)}</span>
            <span>{formatCurrency(goal.targetAmount)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Days Left</p>
              <p className="font-semibold text-foreground">{daysLeft > 0 ? daysLeft : 'Overdue'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="font-semibold text-foreground text-xs capitalize">{goal.category.replace('-', ' ')}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;

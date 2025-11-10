import { Goal } from '@/contexts/FinanceContext';
import { Card } from '@/components/ui/card';
import { Pencil, Target, Calendar, Trash2 } from 'lucide-react';
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
  
  const categoryAccents = {
    'short-term': 'border-l-success',
    'mid-term': 'border-l-primary',
    'long-term': 'border-l-accent'
  };

  const priorityBadges = {
    low: 'bg-muted/50 text-muted-foreground',
    medium: 'bg-accent/10 text-accent',
    high: 'bg-destructive/10 text-destructive'
  };

  return (
    <Card 
      className={`group relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 bg-card border-l-4 ${categoryAccents[goal.category]} border-border h-full flex flex-col`}
      onClick={onClick}
    >
      <div className="p-6 flex-grow">
        {/* Goal Info */}
        <div className="space-y-3">
          <div>
            <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md font-medium ${priorityBadges[goal.priority]}`}>
              {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
            </span>
            <h3 className="font-semibold text-lg text-foreground mt-2 truncate">{goal.name}</h3>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className={daysLeft > 0 ? '' : 'text-destructive'}>
                {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span className="capitalize">{goal.category.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="p-6 pt-0">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-bold text-foreground">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-success font-medium">{formatCurrency(goal.currentAmount)}</span>
            <span className="text-muted-foreground">of {formatCurrency(goal.targetAmount)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-background/80"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
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

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
      className={`group relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 bg-card border-l-4 ${categoryAccents[goal.category]} border-border`}
      onClick={onClick}
    >
      <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Left Section - Goal Info */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground mb-2 truncate">{goal.name}</h3>
              <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md font-medium ${priorityBadges[goal.priority]}`}>
                {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
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

        {/* Right Section - Stats */}
        <div className="flex sm:flex-col gap-6 sm:gap-4 w-full sm:w-auto sm:min-w-[140px]">
          <div className="flex-1 sm:flex-none text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-muted-foreground mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <p className="text-xs font-medium">Deadline</p>
            </div>
            <p className={`font-bold text-sm ${daysLeft > 0 ? 'text-foreground' : 'text-destructive'}`}>
              {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
            </p>
          </div>
          <div className="flex-1 sm:flex-none text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-muted-foreground mb-1">
              <Target className="w-3.5 h-3.5" />
              <p className="text-xs font-medium">Type</p>
            </div>
            <p className="font-bold text-sm text-foreground capitalize">{goal.category.replace('-', ' ')}</p>
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
      </div>
    </Card>
  );
};

export default GoalCard;

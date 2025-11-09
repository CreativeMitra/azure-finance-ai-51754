import { Loan } from '@/contexts/FinanceContext';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingDown, Percent } from 'lucide-react';

interface LoanCardProps {
  loan: Loan;
}

const LoanCard = ({ loan }: LoanCardProps) => {
  const progress = ((loan.principal - loan.remainingAmount) / loan.principal) * 100;
  const monthsLeft = Math.ceil(
    (loan.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  return (
    <Card className="p-6 bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1">{loan.name}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
            {loan.type}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Repayment Progress</span>
            <span className="font-semibold text-foreground">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Paid: {formatCurrency(loan.principal - loan.remainingAmount)}</span>
            <span>Remaining: {formatCurrency(loan.remainingAmount)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/30">
          <div className="flex items-start gap-2">
            <Percent className="w-4 h-4 text-destructive mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Interest Rate</p>
              <p className="font-semibold text-foreground">{loan.interestRate}%</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-destructive mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Monthly EMI</p>
              <p className="font-semibold text-foreground">{formatCurrency(loan.emiAmount)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-border/30">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Time Remaining</p>
            <p className="font-semibold text-foreground">{monthsLeft > 0 ? `${monthsLeft} months` : 'Completed'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LoanCard;

import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/formatters';
import LoanCard from '@/components/loans/LoanCard';
import EmergencyFundTracker from '@/components/loans/EmergencyFundTracker';
import DebtInsights from '@/components/loans/DebtInsights';

const LoansDebt = () => {
  const { loans, addLoan, budgetSettings } = useFinance();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    principal: '',
    remainingAmount: '',
    interestRate: '',
    emiAmount: '',
    startDate: '',
    endDate: '',
    type: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLoan({
      name: formData.name,
      principal: parseFloat(formData.principal),
      remainingAmount: parseFloat(formData.remainingAmount),
      interestRate: parseFloat(formData.interestRate),
      emiAmount: parseFloat(formData.emiAmount),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      type: formData.type
    });
    setFormData({
      name: '',
      principal: '',
      remainingAmount: '',
      interestRate: '',
      emiAmount: '',
      startDate: '',
      endDate: '',
      type: ''
    });
    setIsAddDialogOpen(false);
  };

  const totalDebt = loans.reduce((sum, l) => sum + l.remainingAmount, 0);
  const totalEMI = loans.reduce((sum, l) => sum + l.emiAmount, 0);
  const monthlyIncome = budgetSettings?.monthlyIncome || 0;
  const debtToIncomeRatio = monthlyIncome > 0 ? (totalEMI / monthlyIncome) * 100 : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-destructive bg-clip-text text-transparent">
            Loans & Debt
          </h1>
          <p className="text-muted-foreground mt-2">Manage loans, EMIs, and reduce debt</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Loan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Loan Name</Label>
                <Input
                  id="name"
                  placeholder="Home Loan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Loan Type</Label>
                <Input
                  id="type"
                  placeholder="Home, Car, Personal, Education"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="principal">Principal Amount (₹)</Label>
                  <Input
                    id="principal"
                    type="number"
                    value={formData.principal}
                    onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="remainingAmount">Remaining Amount (₹)</Label>
                  <Input
                    id="remainingAmount"
                    type="number"
                    value={formData.remainingAmount}
                    onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emiAmount">EMI Amount (₹)</Label>
                  <Input
                    id="emiAmount"
                    type="number"
                    value={formData.emiAmount}
                    onChange={(e) => setFormData({ ...formData, emiAmount: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Add Loan</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
          <p className="text-sm text-muted-foreground mb-2">Total Debt</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(totalDebt)}</p>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <p className="text-sm text-muted-foreground mb-2">Total EMI</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(totalEMI)}</p>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Active Loans</p>
          <p className="text-3xl font-bold text-foreground">{loans.length}</p>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
          <p className="text-sm text-muted-foreground mb-2">Debt-to-Income</p>
          <p className="text-3xl font-bold text-foreground">{debtToIncomeRatio.toFixed(1)}%</p>
        </div>
      </div>

      {/* Emergency Fund Tracker */}
      <EmergencyFundTracker />

      {/* AI Debt Insights */}
      <DebtInsights totalDebt={totalDebt} totalEMI={totalEMI} debtToIncomeRatio={debtToIncomeRatio} />

      {/* Loans List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loans.map((loan) => (
          <LoanCard key={loan.id} loan={loan} />
        ))}
      </div>

      {loans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No loans tracked yet. Add your first loan to start managing debt!</p>
        </div>
      )}
    </div>
  );
};

export default LoansDebt;

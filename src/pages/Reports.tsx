import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, TrendingUp, PieChart } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import MonthlyReport from '@/components/reports/MonthlyReport';
import TaxInsights from '@/components/reports/TaxInsights';
import VisualAnalytics from '@/components/reports/VisualAnalytics';

const Reports = () => {
  const { expenses, incomeSources, assetsLiabilities, loans, goals } = useFinance();
  const [reportType, setReportType] = useState('monthly');
  const [reportCategory, setReportCategory] = useState('all');

  const totalIncome = incomeSources.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netWorth = assetsLiabilities.reduce((sum, al) => 
    al.type === 'asset' ? sum + al.value : sum - al.value, 0
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
            Reports & Insights
          </h1>
          <p className="text-muted-foreground mt-2">AI-powered summaries and analysis</p>
        </div>
        <div className="flex gap-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportCategory} onValueChange={setReportCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expenses">Expenses</SelectItem>
              <SelectItem value="investments">Investments</SelectItem>
              <SelectItem value="loans">Loans</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/20">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-xl font-bold">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-destructive/20">
              <FileText className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-xl font-bold">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <PieChart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Worth</p>
              <p className="text-xl font-bold">{formatCurrency(netWorth)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-accent/20">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Goals</p>
              <p className="text-xl font-bold">{goals.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly/Annual Report */}
      <MonthlyReport 
        reportType={reportType}
        expenses={expenses}
        incomeSources={incomeSources}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />

      {/* Visual Analytics */}
      <VisualAnalytics 
        expenses={expenses}
        incomeSources={incomeSources}
        assetsLiabilities={assetsLiabilities}
      />

      {/* Tax & Investment Insights */}
      <TaxInsights 
        totalIncome={totalIncome}
        expenses={expenses}
        assetsLiabilities={assetsLiabilities}
      />
    </div>
  );
};

export default Reports;

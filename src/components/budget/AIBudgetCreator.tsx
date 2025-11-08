import { useState } from 'react';
import { useFinance, BudgetSettings } from '@/contexts/FinanceContext';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface AIBudgetCreatorProps {
  onComplete: () => void;
}

const AIBudgetCreator = ({ onComplete }: AIBudgetCreatorProps) => {
  const { addBudgetCategory, setBudgetSettings } = useFinance();
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<BudgetSettings>({
    monthlyIncome: undefined,
    fixedExpenses: undefined,
    ageGroup: '',
    dependents: 0,
    savingsTarget: undefined,
    loanEMI: undefined,
    emergencyFunds: false,
  });
  const [categories, setCategories] = useState<string[]>(['']);

  const handleAddCategory = () => {
    setCategories([...categories, '']);
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (index: number, value: string) => {
    const updated = [...categories];
    updated[index] = value;
    setCategories(updated);
  };

  const handleGenerateBudget = () => {
    const { monthlyIncome = 0, fixedExpenses = 0, savingsTarget = 0, loanEMI = 0 } = settings;
    
    // Calculate available amount for budget categories
    let availableAmount = monthlyIncome - fixedExpenses - savingsTarget - loanEMI;
    
    // Filter out empty categories
    const validCategories = categories.filter(cat => cat.trim() !== '');
    
    if (validCategories.length === 0 || availableAmount <= 0) {
      alert('Please provide valid categories and ensure income covers expenses.');
      return;
    }

    // AI-powered budget allocation based on category names
    const categoryWeights = validCategories.map(name => {
      const lowerName = name.toLowerCase();
      // Essential categories get higher weight
      if (lowerName.includes('food') || lowerName.includes('groceries')) return 0.3;
      if (lowerName.includes('transport') || lowerName.includes('fuel')) return 0.15;
      if (lowerName.includes('utilities') || lowerName.includes('bills')) return 0.15;
      if (lowerName.includes('health') || lowerName.includes('medical')) return 0.1;
      if (lowerName.includes('entertainment') || lowerName.includes('leisure')) return 0.08;
      if (lowerName.includes('shopping') || lowerName.includes('clothing')) return 0.07;
      return 0.05; // Default weight for other categories
    });

    const totalWeight = categoryWeights.reduce((sum, w) => sum + w, 0);

    // Create budget categories
    validCategories.forEach((name, index) => {
      const allocation = (categoryWeights[index] / totalWeight) * availableAmount;
      addBudgetCategory({
        name,
        budgetAmount: Math.round(allocation * 100) / 100,
      });
    });

    // Add savings category
    if (savingsTarget > 0) {
      addBudgetCategory({
        name: 'Savings',
        budgetAmount: savingsTarget,
      });
    }

    // Add emergency fund category if enabled
    if (settings.emergencyFunds) {
      const emergencyAmount = monthlyIncome * 0.1; // 10% of income
      addBudgetCategory({
        name: 'Emergency Fund',
        budgetAmount: emergencyAmount,
      });
    }

    setBudgetSettings({ ...settings, isAIGenerated: true });
    onComplete();
  };

  if (step === 1) {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">AI Budget Setup</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={settings.monthlyIncome || ''}
                onChange={(e) => setSettings({ ...settings, monthlyIncome: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="fixedExpenses">Fixed Expenses (₹)</Label>
              <Input
                id="fixedExpenses"
                type="number"
                value={settings.fixedExpenses || ''}
                onChange={(e) => setSettings({ ...settings, fixedExpenses: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="ageGroup">Age Group</Label>
              <Select
                value={settings.ageGroup}
                onValueChange={(value) => setSettings({ ...settings, ageGroup: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-25">18-25</SelectItem>
                  <SelectItem value="26-35">26-35</SelectItem>
                  <SelectItem value="36-45">36-45</SelectItem>
                  <SelectItem value="46-60">46-60</SelectItem>
                  <SelectItem value="60+">60+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dependents">Number of Dependents</Label>
              <Input
                id="dependents"
                type="number"
                value={settings.dependents || 0}
                onChange={(e) => setSettings({ ...settings, dependents: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="savingsTarget">Savings Target (₹)</Label>
              <Input
                id="savingsTarget"
                type="number"
                value={settings.savingsTarget || ''}
                onChange={(e) => setSettings({ ...settings, savingsTarget: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="loanEMI">Loan/Debt EMI (₹)</Label>
              <Input
                id="loanEMI"
                type="number"
                value={settings.loanEMI || ''}
                onChange={(e) => setSettings({ ...settings, loanEMI: parseFloat(e.target.value) })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="emergencyFunds">Setup Emergency Funds</Label>
              <Switch
                id="emergencyFunds"
                checked={settings.emergencyFunds}
                onCheckedChange={(checked) => setSettings({ ...settings, emergencyFunds: checked })}
              />
            </div>
          </div>

          <Button onClick={() => setStep(2)} className="w-full" size="lg">
            Next: Add Categories
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Budget Categories</h3>
        </div>

        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor={`category-${index}`}>Category Name</Label>
                <Input
                  id={`category-${index}`}
                  value={category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  placeholder="e.g., Groceries, Transport"
                />
              </div>
              {categories.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCategory(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddCategory}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
            Back
          </Button>
          <Button onClick={handleGenerateBudget} className="flex-1" size="lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Budget
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIBudgetCreator;

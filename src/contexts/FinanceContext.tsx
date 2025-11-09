import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AssetLiability {
  id: string;
  name: string;
  value: number;
  category: string;
  type: 'asset' | 'liability';
  date: Date;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgetAmount: number;
  spent: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
}

export interface BudgetSettings {
  monthlyIncome?: number;
  fixedExpenses?: number;
  ageGroup?: string;
  dependents?: number;
  savingsTarget?: number;
  loanEMI?: number;
  emergencyFunds?: boolean;
  isAIGenerated?: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: 'short-term' | 'mid-term' | 'long-term';
  priority: 'low' | 'medium' | 'high';
  note?: string;
  createdAt: Date;
  funds: GoalFund[];
}

export interface GoalFund {
  id: string;
  amount: number;
  date: Date;
}

export interface Loan {
  id: string;
  name: string;
  principal: number;
  remainingAmount: number;
  interestRate: number;
  emiAmount: number;
  startDate: Date;
  endDate: Date;
  type: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  date: Date;
}

interface FinanceContextType {
  assetsLiabilities: AssetLiability[];
  budgetCategories: BudgetCategory[];
  expenses: Expense[];
  budgetSettings: BudgetSettings | null;
  goals: Goal[];
  loans: Loan[];
  incomeSources: IncomeSource[];
  emergencyFund: number;
  addAssetLiability: (item: Omit<AssetLiability, 'id'>) => void;
  updateAssetLiability: (id: string, item: Partial<AssetLiability>) => void;
  deleteAssetLiability: (id: string) => void;
  addBudgetCategory: (category: Omit<BudgetCategory, 'id' | 'spent'>) => void;
  updateBudgetCategory: (id: string, category: Partial<BudgetCategory>) => void;
  deleteBudgetCategory: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setBudgetSettings: (settings: BudgetSettings) => void;
  resetBudget: () => void;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount' | 'createdAt' | 'funds'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addGoalFund: (goalId: string, fund: Omit<GoalFund, 'id'>) => void;
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  updateLoan: (id: string, loan: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
  addIncomeSource: (income: Omit<IncomeSource, 'id'>) => void;
  updateIncomeSource: (id: string, income: Partial<IncomeSource>) => void;
  deleteIncomeSource: (id: string) => void;
  setEmergencyFund: (amount: number) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assetsLiabilities, setAssetsLiabilities] = useState<AssetLiability[]>(() => {
    const saved = localStorage.getItem('assetsLiabilities');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    }) : [];
  });

  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(() => {
    const saved = localStorage.getItem('budgetCategories');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    }) : [];
  });

  const [budgetSettings, setBudgetSettingsState] = useState<BudgetSettings | null>(() => {
    const saved = localStorage.getItem('budgetSettings');
    return saved ? JSON.parse(saved) : null;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'date' || key === 'deadline' || key === 'createdAt') return new Date(value);
      return value;
    }) : [];
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('loans');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'startDate' || key === 'endDate') return new Date(value);
      return value;
    }) : [];
  });

  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(() => {
    const saved = localStorage.getItem('incomeSources');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    }) : [];
  });

  const [emergencyFund, setEmergencyFundState] = useState<number>(() => {
    const saved = localStorage.getItem('emergencyFund');
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('assetsLiabilities', JSON.stringify(assetsLiabilities));
  }, [assetsLiabilities]);

  useEffect(() => {
    localStorage.setItem('budgetCategories', JSON.stringify(budgetCategories));
  }, [budgetCategories]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    if (budgetSettings) {
      localStorage.setItem('budgetSettings', JSON.stringify(budgetSettings));
    }
  }, [budgetSettings]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('incomeSources', JSON.stringify(incomeSources));
  }, [incomeSources]);

  useEffect(() => {
    localStorage.setItem('emergencyFund', JSON.stringify(emergencyFund));
  }, [emergencyFund]);

  const addAssetLiability = (item: Omit<AssetLiability, 'id'>) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setAssetsLiabilities(prev => [...prev, newItem]);
  };

  const updateAssetLiability = (id: string, item: Partial<AssetLiability>) => {
    setAssetsLiabilities(prev => prev.map(al => al.id === id ? { ...al, ...item } : al));
  };

  const deleteAssetLiability = (id: string) => {
    setAssetsLiabilities(prev => prev.filter(al => al.id !== id));
  };

  const addBudgetCategory = (category: Omit<BudgetCategory, 'id' | 'spent'>) => {
    const newCategory = { ...category, id: crypto.randomUUID(), spent: 0 };
    setBudgetCategories(prev => [...prev, newCategory]);
  };

  const updateBudgetCategory = (id: string, category: Partial<BudgetCategory>) => {
    setBudgetCategories(prev => prev.map(c => c.id === id ? { ...c, ...category } : c));
  };

  const deleteBudgetCategory = (id: string) => {
    setBudgetCategories(prev => prev.filter(c => c.id !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    setExpenses(prev => [...prev, newExpense]);
    
    // Update spent amount in budget category
    const category = budgetCategories.find(c => c.name === expense.category);
    if (category) {
      updateBudgetCategory(category.id, { spent: category.spent + expense.amount });
    }
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    const oldExpense = expenses.find(e => e.id === id);
    if (oldExpense) {
      // Adjust old category spent
      const oldCategory = budgetCategories.find(c => c.name === oldExpense.category);
      if (oldCategory) {
        updateBudgetCategory(oldCategory.id, { spent: oldCategory.spent - oldExpense.amount });
      }
      
      // Adjust new category spent
      const newCategory = budgetCategories.find(c => c.name === (updatedExpense.category || oldExpense.category));
      if (newCategory) {
        updateBudgetCategory(newCategory.id, { spent: newCategory.spent + (updatedExpense.amount || oldExpense.amount) });
      }
    }
    
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updatedExpense } : e));
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      const category = budgetCategories.find(c => c.name === expense.category);
      if (category) {
        updateBudgetCategory(category.id, { spent: category.spent - expense.amount });
      }
    }
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const setBudgetSettings = (settings: BudgetSettings) => {
    setBudgetSettingsState(settings);
  };

  const resetBudget = () => {
    setBudgetCategories(prev => prev.map(c => ({ ...c, spent: 0 })));
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount' | 'createdAt' | 'funds'>) => {
    const newGoal: Goal = { 
      ...goal, 
      id: crypto.randomUUID(), 
      currentAmount: 0,
      createdAt: new Date(),
      funds: []
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, goal: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...goal } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addGoalFund = (goalId: string, fund: Omit<GoalFund, 'id'>) => {
    const newFund: GoalFund = { ...fund, id: crypto.randomUUID() };
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: g.currentAmount + fund.amount,
          funds: [...g.funds, newFund]
        };
      }
      return g;
    }));
  };

  const addLoan = (loan: Omit<Loan, 'id'>) => {
    const newLoan = { ...loan, id: crypto.randomUUID() };
    setLoans(prev => [...prev, newLoan]);
  };

  const updateLoan = (id: string, loan: Partial<Loan>) => {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, ...loan } : l));
  };

  const deleteLoan = (id: string) => {
    setLoans(prev => prev.filter(l => l.id !== id));
  };

  const addIncomeSource = (income: Omit<IncomeSource, 'id'>) => {
    const newIncome = { ...income, id: crypto.randomUUID() };
    setIncomeSources(prev => [...prev, newIncome]);
  };

  const updateIncomeSource = (id: string, income: Partial<IncomeSource>) => {
    setIncomeSources(prev => prev.map(i => i.id === id ? { ...i, ...income } : i));
  };

  const deleteIncomeSource = (id: string) => {
    setIncomeSources(prev => prev.filter(i => i.id !== id));
  };

  const setEmergencyFund = (amount: number) => {
    setEmergencyFundState(amount);
  };

  return (
    <FinanceContext.Provider value={{
      assetsLiabilities,
      budgetCategories,
      expenses,
      budgetSettings,
      goals,
      loans,
      incomeSources,
      emergencyFund,
      addAssetLiability,
      updateAssetLiability,
      deleteAssetLiability,
      addBudgetCategory,
      updateBudgetCategory,
      deleteBudgetCategory,
      addExpense,
      updateExpense,
      deleteExpense,
      setBudgetSettings,
      resetBudget,
      addGoal,
      updateGoal,
      deleteGoal,
      addGoalFund,
      addLoan,
      updateLoan,
      deleteLoan,
      addIncomeSource,
      updateIncomeSource,
      deleteIncomeSource,
      setEmergencyFund,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};

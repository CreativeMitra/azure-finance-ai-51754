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

interface FinanceContextType {
  assetsLiabilities: AssetLiability[];
  budgetCategories: BudgetCategory[];
  expenses: Expense[];
  budgetSettings: BudgetSettings | null;
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

  return (
    <FinanceContext.Provider value={{
      assetsLiabilities,
      budgetCategories,
      expenses,
      budgetSettings,
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
